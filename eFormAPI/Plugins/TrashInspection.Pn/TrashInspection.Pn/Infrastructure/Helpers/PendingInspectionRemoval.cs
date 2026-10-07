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
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;

namespace TrashInspection.Pn.Infrastructure.Helpers
{
    /// <summary>
    /// Pure, testable selection logic for the deferred device-side eForm removal that is
    /// triggered by the external/automated weighing-system delete. The matching delete handler
    /// only marks the inspection as InspectionDone and stamps UpdatedAt; this query finds the
    /// cases whose deferral window has elapsed so the worker can remove them.
    /// </summary>
    public static class PendingInspectionRemoval
    {
        /// <summary>
        /// Returns the still-live <see cref="TrashInspectionCase"/> rows that belong to an
        /// inspection which was flagged for deferred removal (InspectionDone == true) more than
        /// <paramref name="delaySeconds"/> ago and has not itself been removed (e.g. by an admin
        /// delete).
        /// </summary>
        public static async Task<List<TrashInspectionCase>> GetCasesDueForRemoval(
            TrashInspectionPnDbContext db, int delaySeconds, DateTime utcNow)
        {
            DateTime cutoff = utcNow.AddSeconds(-delaySeconds);

            return await db.TrashInspectionCases
                .Where(c => c.WorkflowState != Constants.WorkflowStates.Removed)
                .Where(c => db.TrashInspections.Any(ti =>
                    ti.Id == c.TrashInspectionId
                    && ti.InspectionDone
                    && ti.WorkflowState != Constants.WorkflowStates.Removed
                    && ti.UpdatedAt < cutoff))
                .ToListAsync();
        }
    }
}
