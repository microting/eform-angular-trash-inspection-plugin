# Surface NAV delivery status and allow per-row resend

**Date:** 2026-08-13
**Repos:** `eform-angular-trash-inspection-plugin` (branch `feat/nav-resend`), `trash-inspection-container` (branch `main`)

## Problem

When a trash inspection is completed, the background service posts it to Odense's NAV
endpoint and records the outcome on the `TrashInspection` row. When that post fails —
or never happens — nothing in the web UI shows it. The inspection looks delivered.

Measured in tenant 741 on 2026-08-12, across completed, non-removed inspections:

| State | Count | Span |
|---|---|---|
| Sent, NAV confirmed | 3,717 | 2020-04 → present |
| Never sent, no error recorded | 259 | 2019-03 → 2026-08 |
| Flagged sent but no success message | 34 | 2020-11 → 2026-07 |
| Failed with a recorded error | 31 | 2020-04 → 2026-07 |

The 259 silent ones are invisible today. Their age distribution matters:

| Year | Never sent | of which `ApprovedValue` empty |
|---|---|---|
| 2019 | 87 | 24 |
| 2020 | 154 | 0 |
| 2021 | 1 | 0 |
| 2023 | 2 | 0 |
| 2025 | 6 | 0 |
| 2026 | 9 | 0 |

241 of 259 predate the working NAV integration. Only 18 are genuinely actionable.
**This is why the resend action is per-row only** — no bulk action can flood NAV.

Recorded failures split into two kinds the UI must distinguish:

- **Transient/retryable** — `No route to host` (18), timeouts (8), `HTTP 401 ... NTLM` (4)
- **Permanently rejected** — `The Vejehoved does not exist. Vejenr.='V176209'` (2).
  NAV does not know that weighing number; retrying can never succeed.

## Goals

1. Show NAV delivery state for every inspection in the list.
2. Let an operator filter to the ones not delivered.
3. Let an operator retry a single undelivered inspection and see the real result.

## Non-goals

- Bulk resend.
- Touching `eform-service-trash-inspection-plugin`.
- Moving shared code into `eform-trashinspection-base`.
- Any database migration.

## Key constraints discovered

**The payload is two values.** NAV receives only `_WeighingNo` and `_Approved`, both
stored on the entity. A resend needs no SDK read, no eForm lookup, no case replay.
(Timezone is therefore a non-issue for this feature.)

**Rebus is deliberately dead in the API plugin.** `EformTrashInspectionPlugin.cs:147-154`
documents that it is not started because the plugin loads in an isolated
`AssemblyLoadContext` where Rebus's JSON serializer cannot resolve plugin-owned message
types. `SendLocal`/`Publish`/`IHandleMessages` have zero live occurrences. (Dead
`IRebusService`, `RebusService`, `RebusInstaller` and `Messages/*.cs` still exist and
will tempt a reader — they are not usable.) The API must send NAV traffic itself.

**The base package is consumed as NuGet.** `TrashInspection.Pn.csproj:30` references
`Microting.eFormTrashInspectionBase` 10.0.35. Base-repo code would need a package
publish before the API could use it, and with the service cleanup out of scope the base
would have no second consumer — so the sender lives in `TrashInspection.Pn`.

**NTLM needs container support the API image lacked.** Fixed; see section 4.

**`ResponseSendToCallBackUrl` is already exposed** — already on `TrashInspectionModel:77`
and already projected at `TrashInspectionService.cs:892`. Only the two message fields
need adding.

**There is no optimistic concurrency on the entity.** `PnBase.UpdateInternal` increments
a plain `int Version` manually; there is no `[ConcurrencyCheck]` or rowversion. Any
"check the flag then send" logic is a TOCTOU race. See D1.

## Design

### 1. NAV sender — `eFormAPI/Plugins/TrashInspection.Pn/TrashInspection.Pn/`

- `Infrastructure/Helpers/NavSoap.cs` — `BuildWeighingFromMicroting2Envelope`,
  `ParseReturnValue`, namespace + SOAPAction constants. Functionally a copy of the
  service plugin's helper (duplication accepted). LINQ-to-XML, so values are escaped.
- `Infrastructure/Models/Nav/NavCallbackSettings.cs` — the five settings values.
- `Infrastructure/Models/Nav/NavCallResult.cs` — `Success`, `ReturnValue`, `Error`.
- `Abstractions/INavCallbackSender.cs` + `Services/NavCallbackSender.cs`:
  `Task<NavCallResult> SendAsync(NavCallbackSettings, string weighingNumber, bool approved, CancellationToken)`.

The sender performs no persistence — a pure function from inputs to result, so the
caller owns entity mutation.

**D2 — success predicate.** `Success` requires **all** of: 2xx status, a non-null
parsed `return_value`, and no `soap:Fault` descendant. A 2xx carrying a SOAP fault, an
HTML error page, or an empty body is a **failure**. `XDocument.Parse` must be wrapped —
a non-XML body throws. This matters: the existing service sets the sent flag on any 2xx
and stores a possibly-null `return_value`, which is the mechanism behind the 34
"flagged sent but unconfirmed" rows (still occurring — one in 2026). Real NAV successes
look like `Afsl. Vejenr. V243141 opdateret`, so a null `return_value` means it did not
land. Never set `ResponseSendToCallBackUrl` when `ReturnValue` is null.

**D3 — testability seam.** The handler must be injectable or none of the tests can be
written:
```csharp
public NavCallbackSender(Func<NetworkCredential, HttpMessageHandler> handlerFactory = null)
    => _handlerFactory = handlerFactory ?? (c => new HttpClientHandler { Credentials = c });
```
Per-call handler is deliberate — NTLM authenticates the TCP connection, so
`IHttpClientFactory` handler pooling is actively wrong here and diverges from the
verified service implementation. Timeout is injectable too, so the timeout test does not
take 30 real seconds. Default timeout 30s (production NAV timeouts have reached 60s and
this now runs on a request thread).

Credentials: 3-arg `NetworkCredential` with domain when `CallBackCredentialDomain != "..."`,
2-arg otherwise. On non-success capture status, reason, `WWW-Authenticate` and body.

### 2. API surface — same project

- `TrashInspectionModel`: add `SuccessMessageFromCallBack`, `ErrorFromCallBack`, `NavEnabled`.
- **D4 — do not widen the shared projection blindly.** `AddSelectToQuery` also backs
  `Read(weighingNumber, token)`, reachable **unauthenticated** via
  `GET api/trash-inspection-pn/inspection-results/{weighingNumber}?token=…`. `ErrorFromCallBack`
  contains HTTP status, `WWW-Authenticate` and the raw response body — internal hostnames
  and IPs. Add an `includeNavMessages` parameter; pass `true` from `Index` and `Read(int)`,
  `false` from the anonymous path.
- **D5 — truncate.** Cap `ErrorFromCallBack` at 200 chars in the projection/response.
  `apiBase.service.ts` auto-toasts `body.message`, so a multi-KB HTML error would be
  dumped into a toast.
- `TrashInspectionRequestModel`: add `string NavStatusFilter`.
- `Index` filter values, applied alongside `NameFilter`:
  - `notSent` → not sent, no error
  - `failed` → not sent, error present
  - `unconfirmed` → sent, no success message  *(the 34)*
  - `sent` → sent with a success message
  - null/`all` → no filter
- New endpoint at `TrashInspectionController.cs:85` (keeps the authenticated block
  contiguous, ahead of the `[AllowAnonymous]` block):
  `POST api/trash-inspection-pn/inspections/{id}/send-to-nav` → `Task<OperationResult>`,
  **`[Authorize(Policy = TrashInspectionClaims.UpdateTrashInspections)]`**.

**D6 — permission.** Use `UpdateTrashInspections` (`tip_tiu`), not
`AccessTrashInspectionPlugin`. `tip_a` means "can see the module"; this action is an
irreversible write into a customer's production ERP. `tip_tiu` already exists
(`TrashInspectionClaims.cs:11`), is already seeded, and is verified granted+enabled in
tenant 741 — so there is no rollout step.

`TrashInspectionService.SendToNav(int id)`:

1. **D1 — claim the row atomically.** `SELECT GET_LOCK(CONCAT('ti_nav_', @id), 0)`
   (fail-fast, works across API replicas). Re-read the entity *inside* the lock. Release
   in `finally`. Preferred over `SELECT … FOR UPDATE`, which would pin a row lock for the
   full 30s. Without this, a double-click or two operators each post a real weighing to
   NAV — the "already sent" flag alone only guards *sequential completed* attempts.
2. Reject with a clear message when: not found; `WorkflowState == removed`;
   `Status != 100`; `WeighingNumber` empty; `ResponseSendToCallBackUrl` already true
   with a success message; **`ApprovedValue` null/empty** (D7); `CallBackUrl` empty or
   `"..."`; `CallbackCredentialAuthType != "NTLM"` (D8).
3. Call the sender.
4. Persist, always stamping `UpdatedByUserId = _userService.UserId` and `UpdatedAt`:
   - success → `ResponseSendToCallBackUrl = true`, `SuccessMessageFromCallBack = ReturnValue`,
     `ErrorFromCallBack = null`
   - failure → `ErrorFromCallBack = Error` (truncated), sent flag untouched
5. Log before (user id, inspection id, weighing no, approved) and after (outcome).
6. Return `OperationResult` carrying the real NAV message.

**D7 — `ApprovedValue` guard.** `_Approved` comes from stored `IsApproved`. 24 of the
2019 never-sent rows have empty `ApprovedValue` and 31 have `IsApproved = false` — they
predate the handler that populates it. Resending those would silently deliver
"not approved" for a 2019 load. Reject when `ApprovedValue` is null/empty, and show
weighing number, date and approved value in the confirmation dialog so the operator
confirms the actual payload.

**D8 — auth type.** The service branches on `CallbackCredentialAuthType`; `"basic"`
uses a WCF `BasicHttpBinding`. This sender is NTLM-shaped only, so it must reject other
auth types explicitly rather than silently using a different transport than the service.

**D9 — `UpdateInternal` is gated on a global `ChangeTracker.HasChanges()`.** A repeated
*identical* failure would otherwise change nothing — no version row, no `UpdatedAt` bump,
and the click looks like a no-op. Always stamping `UpdatedByUserId`/`UpdatedAt` on the
failure path guarantees a version row, which is the only audit trail for this action.

### 3. Angular — `eform-client/src/app/plugins/modules/trash-inspection-pn/`

`TrashInspectionPnModel`: add `responseSendToCallBackUrl`, `successMessageFromCallBack`,
`errorFromCallBack`, `navEnabled`.

New **NAV** column via a `#navTpl` registered in the grid's `cellTemplate` map. Every
existing boolean column uses `formatter:` returning a raw HTML string bound via
`innerHTML`; that cannot carry a `matTooltip` **and** would inject a remote response
body as HTML. Use an `<ng-template>` with `[matTooltip]` binding, like `statusTpl`.

| Condition | Cell |
|---|---|
| sent **and** `successMessageFromCallBack` | green check, tooltip = success message |
| sent **and no** success message | amber help icon, "Sent, unconfirmed" *(the 34)* |
| not sent **and** `errorFromCallBack` | red error icon, tooltip = the NAV error |
| otherwise | grey dash, "Not sent to NAV" |

Sortable via `sortProp: {id: 'ResponseSendToCallBackUrl'}` — sorting runs pre-projection
against entity property names.

Toolbar `mat-select` filter (All / Not sent / Failed / Sent unconfirmed / Sent) threaded
through `TrashInspectionFiltrationModel` (reducer) → `trashInspectionUpdateFilters`
(widen the payload type) → state service → `TrashInspectionsPnRequestModel.navStatusFilter`.
The request is assembled by spread, so the field must exist in the reducer's filter state.

Per-row send button, shown when
`row.navEnabled && row.status === 100 && !(row.responseSendToCallBackUrl && row.successMessageFromCallBack)`,
gated client-side on `tip_tiu`. Disabled with a spinner while in flight (D10). Confirmation
dialog shows weighing number, date and approved value. The "sent, unconfirmed" case gets
a stronger warning: NAV may already have this weighing.

**D11 — hide the feature for non-NAV tenants.** `CallBackUrl` seeds to `"..."`, so every
other customer would otherwise get a NAV column reading "not sent" on every row plus a
button that always fails. `Index` already reads settings, so return `navEnabled` and hide
column, filter and button when it is false.

**D10 — one toast.** `apiBase.service.ts` auto-toasts `body.message` on both success and
failure, so the component must not toast as well.

i18n keys in the plugin's `da.ts` and `en-US.ts`: `NAV`, `Sent to NAV`,
`Not sent to NAV`, `Failed to send to NAV`, `Sent to NAV, unconfirmed`, `Send to NAV`,
`Are you sure you want to send this inspection to NAV`, `Sent to NAV successfully`.
(Only `da` and `en-US` ship; other host locales render keys raw — pre-existing.)

### 4. Container — `trash-inspection-container/Dockerfile` (DONE 2026-08-13)

Mirrors `Dockerfile-service`: `gss-ntlmssp` in the apt list, the `openssl-legacy.cnf`
write, and `ENV OPENSSL_CONF`, with the explanatory comments carried over. `.NET` NTLM on
Linux needs GSSAPI plus OpenSSL 3's legacy provider (MD4/RC4/DES); without it the call
401s even though everything compiles.

## Testing

Test project `TrashInspection.Pn.Test/` (NUnit 4.6.1, NSubstitute 6.0.0, net10.0). Its
`DbTestFixture` is abstract and needs a live MariaDB — new fixtures must **not** inherit
it, so they run with no database.

- `NavSoap`: envelope shape, bool serialization, XML escaping, `return_value` extraction,
  missing `return_value`.
- `NavCallbackSender` via stub `HttpMessageHandler`: success; 2xx with null
  `return_value` → failure; 2xx `soap:Fault` → failure; non-XML 2xx body → failure, no
  throw; 401 with `WWW-Authenticate` captured; timeout.
- Manual browser verification against tenant 741 before commit.

## Open question for the product owner

**No age cutoff is implemented.** The data says 241 of 259 unsent rows are 2019–2020 and
"almost certainly should never be sent", but the go-live date is inferred, not stated, so
a hard-coded cutoff is a business rule this spec declines to invent. D7 blocks the 24
worst rows (empty `ApprovedValue`) and the dialog shows the date. If a cutoff is wanted,
it is a one-line server-side guard.

## Risks

- **Sending is real and irreversible.** Guards: per-row only, `tip_tiu`, atomic lock,
  hidden once confirmed-delivered, confirmation dialog showing the payload.
- **The Dockerfile change and the API code must deploy together.**
- **`NavSoap` is duplicated** with the service plugin. Accepted; unify when the WCF path
  is retired.
- **Two writers, divergent semantics.** This path clears `ErrorFromCallBack` on success
  and requires a non-null `return_value`; the background service still does neither. The
  34-row defect will keep recurring on the service's path until it is fixed there too —
  out of scope by choice, not a technical constraint.
- Sorting the NAV column sorts by the boolean only, so "failed" and "never sent"
  interleave; the filter is the precise tool.
