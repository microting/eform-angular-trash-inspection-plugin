/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 microting

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
using eFormShared;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;
using Rebus.Handlers;
using TrashInspection.Pn.Infrastructure.Models;
using TrashInspection.Pn.Messages;

namespace TrashInspection.Pn.Handlers
{
    public class TrashInspectionDeleteHandler : IHandleMessages<TrashInspectionDeleted>
    {
        private readonly Core _core;
        private readonly TrashInspectionPnDbContext _dbContext;
        
        public TrashInspectionDeleteHandler(Core core, TrashInspectionPnDbContext context)
        {
            _core = core;
            _dbContext = context;
        }
        
        #pragma warning disable 1998
        public async Task Handle(TrashInspectionDeleted message)
        {
            TrashInspectionModel createModel = message.TrashInspectionModel;

            List<TrashInspectionCase> trashInspectionCases = _dbContext.TrashInspectionCases
                .Where(x => x.TrashInspectionId == createModel.Id).ToList();

            foreach (TrashInspectionCase trashInspectionCase in trashInspectionCases)
            {
                bool result = _core.CaseDelete(trashInspectionCase.SdkCaseId);
                if (result)
                {
                    trashInspectionCase.WorkflowState = Constants.WorkflowStates.Removed;
                    trashInspectionCase.Version += 1;
                    trashInspectionCase.UpdatedAt = DateTime.Now;
                    await _dbContext.SaveChangesAsync();
                    
                    TrashInspectionCaseVersion trashInspectionCaseVersion = new TrashInspectionCaseVersion();
                    trashInspectionCaseVersion.TrashInspectionCaseId = trashInspectionCase.Id;
                    trashInspectionCaseVersion.SegmentId = trashInspectionCase.SegmentId;
                    trashInspectionCaseVersion.TrashInspectionId = trashInspectionCase.TrashInspectionId;
                    trashInspectionCaseVersion.SdkCaseId = trashInspectionCase.SdkCaseId;
                    trashInspectionCaseVersion.SdkSiteId = trashInspectionCase.SdkSiteId;
                    trashInspectionCaseVersion.CreatedAt = trashInspectionCase.CreatedAt;
                    trashInspectionCaseVersion.UpdatedAt = trashInspectionCase.UpdatedAt;
                    trashInspectionCaseVersion.Version = trashInspectionCase.Version;

                    _dbContext.TrashInspectionCaseVersions.Add(trashInspectionCaseVersion);
                    
                    await _dbContext.SaveChangesAsync();
                }
                
            }
            
            createModel.InspectionDone = true;
            createModel.Update(_dbContext);

        }
    }
}