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
using eFormCore;
using Microsoft.EntityFrameworkCore;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using TrashInspection.Pn.Infrastructure.Helpers;
using TrashInspection.Pn.Infrastructure.Models;
using TrashInspection.Pn.Messages;

namespace TrashInspection.Pn.Handlers
{
    public class TrashInspectionDeleteHandler
    {
        private readonly Core _core;
        private readonly TrashInspectionPnDbContext _dbContext;

        public TrashInspectionDeleteHandler(Core core, DbContextHelper dbContextHelper)
        {
            _core = core;
            _dbContext = dbContextHelper.GetDbContext();
        }

        #pragma warning disable 1998
        public async Task Handle(TrashInspectionDeleted message)
        {
            try
            {
                TrashInspectionModel createModel = message.TrashInspectionModel;

                Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection trashInspection = await
                    _dbContext.TrashInspections.SingleAsync(x => x.Id == createModel.Id);

                if (message.ShouldDelete)
                {
                    // Admin-initiated delete (Delete(int id)): remove immediately, as before.
                    // The user explicitly asked to delete, so cutting off any device-side
                    // eForm is the intended behavior here.
                    List<TrashInspectionCase> trashInspectionCases = _dbContext.TrashInspectionCases
                        .Where(x => x.TrashInspectionId == createModel.Id).ToList();

                    foreach (TrashInspectionCase trashInspectionCase in trashInspectionCases)
                    {
                        // Guard against a malformed SdkCaseId so one bad row can't throw and
                        // leave the inspection half-deleted (mirrors PendingInspectionRemovalWorker).
                        if (!int.TryParse(trashInspectionCase.SdkCaseId, out int sdkCaseId))
                        {
                            continue;
                        }

                        bool result = await _core.CaseDelete(sdkCaseId);
                        if (result)
                        {
                            await trashInspectionCase.Delete(_dbContext);
                        }
                    }

                    trashInspection.InspectionDone = true;
                    await trashInspection.Update(_dbContext);

                    await trashInspection.Delete(_dbContext);
                }
                else
                {
                    // External/automated delete (Delete(string weighingNumber, token) from the
                    // weighing system): DEFER the device-side eForm removal instead of firing it
                    // immediately. Calling _core.CaseDelete here pushes the device sync at once and
                    // would orphan a worker who is still filling in the inspection on their device.
                    //
                    // We only mark the inspection as InspectionDone and stamp UpdatedAt = now (via
                    // Update). PendingInspectionRemovalWorker later picks up inspections whose
                    // UpdatedAt is older than the configured delay and performs the CaseDelete then.
                    // The cases are intentionally left untouched (WorkflowState stays "Created").
                    trashInspection.InspectionDone = true;
                    await trashInspection.Update(_dbContext);
                }
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.Message);
            }
        }
    }
}