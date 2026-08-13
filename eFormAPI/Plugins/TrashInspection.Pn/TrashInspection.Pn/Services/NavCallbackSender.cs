/*
The MIT License (MIT)

Copyright (c) 2007 - 2026 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Xml.Linq;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Helpers;
using TrashInspection.Pn.Infrastructure.Models.Nav;

namespace TrashInspection.Pn.Services
{
    /// <summary>
    /// Posts a weighing to the NAV MicrotingWS endpoint over NTLM.
    /// <para>
    /// WCF's ChannelFactory NTLM handshake fails on modern .NET against servers that offer only
    /// 'WWW-Authenticate: NTLM' (single scheme), which is exactly what this NAV endpoint returns
    /// (dotnet/wcf #4520, #4094, #5515), so the SOAP call is issued via HttpClient. NTLM on the
    /// Linux container additionally requires gss-ntlmssp + the OpenSSL legacy provider, enabled in
    /// the API Dockerfile, otherwise the handshake crypto is unavailable and the server returns 401.
    /// </para>
    /// <para>
    /// The handler is created per call on purpose: NTLM authenticates the TCP connection, so
    /// IHttpClientFactory handler pooling is actively wrong here.
    /// </para>
    /// </summary>
    public class NavCallbackSender : INavCallbackSender
    {
        private static readonly TimeSpan DefaultTimeout = TimeSpan.FromSeconds(30);

        private readonly Func<NetworkCredential, HttpMessageHandler> _handlerFactory;
        private readonly TimeSpan _timeout;

        public NavCallbackSender(Func<NetworkCredential, HttpMessageHandler> handlerFactory = null,
            TimeSpan? timeout = null)
        {
            _handlerFactory = handlerFactory ?? (c => new HttpClientHandler { Credentials = c });
            _timeout = timeout ?? DefaultTimeout;
        }

        public async Task<NavCallResult> SendAsync(NavCallbackSettings settings, string weighingNumber, bool approved,
            CancellationToken cancellationToken = default)
        {
            var credential = settings.CallBackCredentialDomain != "..."
                ? new NetworkCredential(settings.CallbackCredentialUserName, settings.CallbackCredentialPassword,
                    settings.CallBackCredentialDomain)
                : new NetworkCredential(settings.CallbackCredentialUserName, settings.CallbackCredentialPassword);

            using var handler = _handlerFactory(credential);
            using var httpClient = new HttpClient(handler, false) { Timeout = _timeout };

            try
            {
                using var content = new StringContent(
                    NavSoap.BuildWeighingFromMicroting2Envelope(weighingNumber, approved), Encoding.UTF8, "text/xml");
                content.Headers.Add("SOAPAction", $"\"{NavSoap.WeighingFromMicroting2Action}\"");

                var response = await httpClient.PostAsync(settings.CallBackUrl, content, cancellationToken);
                var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);

                if (!response.IsSuccessStatusCode)
                {
                    var wwwAuthenticate = response.Headers.WwwAuthenticate.Count > 0
                        ? string.Join(", ", response.Headers.WwwAuthenticate)
                        : "(none)";
                    return Failure($"HTTP {(int)response.StatusCode} {response.ReasonPhrase}. " +
                                   $"WWW-Authenticate: {wwwAuthenticate}. Body: {responseBody}");
                }

                // D2: a 2xx alone is not proof of delivery. NAV answers a real success with a
                // return_value such as "Afsl. Vejenr. V243141 opdateret", so a soap:Fault, a
                // non-XML body (an HTML error page) or a missing return_value is a failure.
                XDocument document;
                try
                {
                    document = XDocument.Parse(responseBody);
                }
                catch (Exception e)
                {
                    return Failure($"NAV returned a non-XML response: {e.Message}. Body: {responseBody}");
                }

                var fault = document.Descendants().FirstOrDefault(x => x.Name.LocalName == "Fault");
                if (fault != null)
                {
                    return Failure($"NAV returned a SOAP fault: {fault.Value}");
                }

                // Whitespace, not just null: ParseReturnValue yields "" for <return_value/>, and
                // treating that as success would set the sent flag, wipe the previous error and
                // leave the row in exactly the "sent but unconfirmed" state this guard exists to
                // prevent - with an empty message, so no toast would reach the operator either.
                var returnValue = NavSoap.ParseReturnValue(document);
                if (string.IsNullOrWhiteSpace(returnValue))
                {
                    return Failure($"NAV returned no return_value. Body: {responseBody}");
                }

                return new NavCallResult { Success = true, ReturnValue = returnValue };
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                throw;
            }
            catch (OperationCanceledException)
            {
                return Failure($"NAV did not respond within {_timeout.TotalSeconds:0.##} seconds.");
            }
            catch (Exception e)
            {
                return Failure(e.Message);
            }
        }

        private static NavCallResult Failure(string error)
        {
            return new NavCallResult { Success = false, Error = error };
        }
    }
}
