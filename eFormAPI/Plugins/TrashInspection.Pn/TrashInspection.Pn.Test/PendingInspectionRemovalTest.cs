/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

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
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure.Constants;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using NUnit.Framework;
using TrashInspection.Pn.Infrastructure.Helpers;

namespace TrashInspection.Pn.Test
{
    [TestFixture]
    public class PendingInspectionRemovalTest : DbTestFixture
    {
        // Fixed "now" so the timing comparisons are deterministic.
        private static readonly DateTime UtcNow = new DateTime(2026, 06, 16, 12, 00, 00, DateTimeKind.Utc);
        private const int DelaySeconds = 1800; // 30 min

        protected override void DoSetup()
        {
            // TrashInspection and TrashInspectionCase carry non-nullable FK columns
            // (Fraction/Segment/Installation on the inspection, Segment on the case). Seed one
            // minimal parent row (Id=1) for each so Create() does not trip the FK constraints.
            DbContext.Database.ExecuteSqlRaw(
                "INSERT INTO `Segments` (`Id`,`CreatedAt`,`CreatedByUserId`,`UpdatedByUserId`,`Version`,`SdkFolderId`) " +
                "VALUES (1, UTC_TIMESTAMP(), 1, 1, 1, 1)");
            DbContext.Database.ExecuteSqlRaw(
                "INSERT INTO `Fractions` (`Id`,`CreatedAt`,`CreatedByUserId`,`UpdatedByUserId`,`Version`,`eFormId`,`eFormIdExtendedInspection`) " +
                "VALUES (1, UTC_TIMESTAMP(), 1, 1, 1, 1, 0)");
            DbContext.Database.ExecuteSqlRaw(
                "INSERT INTO `Installations` (`Id`,`CreatedAt`,`CreatedByUserId`,`UpdatedByUserId`,`Version`) " +
                "VALUES (1, UTC_TIMESTAMP(), 1, 1, 1)");
        }

        [Test]
        public async Task GetCasesDueForRemoval_ReturnsOnlyDueLiveCases()
        {
            // A: deferred-pending, older than the delay, live case => DUE (the only one expected).
            var caseA = await SeedScenario(
                inspectionDone: true,
                inspectionWorkflowState: Constants.WorkflowStates.Created,
                inspectionUpdatedAt: UtcNow.AddMinutes(-31),
                caseWorkflowState: Constants.WorkflowStates.Created);

            // B: deferred-pending but still inside the delay window => NOT due.
            await SeedScenario(
                inspectionDone: true,
                inspectionWorkflowState: Constants.WorkflowStates.Created,
                inspectionUpdatedAt: UtcNow.AddMinutes(-5),
                caseWorkflowState: Constants.WorkflowStates.Created);

            // C: not flagged for deferred removal (InspectionDone == false) => NOT returned.
            await SeedScenario(
                inspectionDone: false,
                inspectionWorkflowState: Constants.WorkflowStates.Created,
                inspectionUpdatedAt: UtcNow.AddMinutes(-60),
                caseWorkflowState: Constants.WorkflowStates.Created);

            // D: deferred-pending, old, but the case is already removed => NOT returned.
            await SeedScenario(
                inspectionDone: true,
                inspectionWorkflowState: Constants.WorkflowStates.Created,
                inspectionUpdatedAt: UtcNow.AddMinutes(-60),
                caseWorkflowState: Constants.WorkflowStates.Removed);

            // E: old + InspectionDone but the inspection itself was admin-deleted (Removed) => NOT returned.
            await SeedScenario(
                inspectionDone: true,
                inspectionWorkflowState: Constants.WorkflowStates.Removed,
                inspectionUpdatedAt: UtcNow.AddMinutes(-60),
                caseWorkflowState: Constants.WorkflowStates.Created);

            List<TrashInspectionCase> due =
                await PendingInspectionRemoval.GetCasesDueForRemoval(DbContext, DelaySeconds, UtcNow);

            Assert.That(due.Count, Is.EqualTo(1));
            Assert.That(due.Single().Id, Is.EqualTo(caseA.Id));
        }

        /// <summary>
        /// Seeds one TrashInspection + one TrashInspectionCase with explicit InspectionDone /
        /// WorkflowState / UpdatedAt values. We persist via Create (which stamps UpdatedAt = now),
        /// then override the audit/state fields directly and SaveChanges so the timing is
        /// deterministic rather than dependent on wall-clock.
        /// </summary>
        private async Task<TrashInspectionCase> SeedScenario(
            bool inspectionDone,
            string inspectionWorkflowState,
            DateTime inspectionUpdatedAt,
            string caseWorkflowState)
        {
            var inspection = new Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection
            {
                Status = 0,
                Date = UtcNow,
                Time = UtcNow,
                WeighingNumber = Guid.NewGuid().ToString("N"),
                FractionId = 1,
                SegmentId = 1,
                InstallationId = 1
            };
            await inspection.Create(DbContext);

            var trashCase = new TrashInspectionCase
            {
                TrashInspectionId = inspection.Id,
                SdkCaseId = "1",
                SdkSiteId = 1,
                Status = 0,
                SegmentId = 1
            };
            await trashCase.Create(DbContext);

            // Override the state/timing fields deterministically and persist without re-stamping.
            inspection.InspectionDone = inspectionDone;
            inspection.WorkflowState = inspectionWorkflowState;
            inspection.UpdatedAt = inspectionUpdatedAt;

            trashCase.WorkflowState = caseWorkflowState;

            await DbContext.SaveChangesAsync();

            return trashCase;
        }
    }
}
