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
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Rebus.Handlers;
using TrashInspection.Pn.Messages;
using eFormCore;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure.Constants;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Rebus.Bus;
using TrashInspection.Pn.Infrastructure.Helpers;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Handlers
{
    public class TrashInspectionReceivedHandler : IHandleMessages<TrashInspectionReceived>
    {
        private readonly Core _core;
        private readonly TrashInspectionPnDbContext _dbContext;
        private readonly IBus _bus;
        
        public TrashInspectionReceivedHandler(Core core, DbContextHelper dbContextHelper, IBus bus)
        {
            _core = core;
            _dbContext = dbContextHelper.GetDbContext();
            _bus = bus;
        }
        
        #pragma warning disable 1998
        public async Task Handle(TrashInspectionReceived message)
        {

            LogEvent($"TrashInspectionReceivedHandler.Handle: called for message.TrashInspectionModel.WeighingNumber {message.TrashInspectionModel.WeighingNumber}");
            TrashInspectionModel createModel = message.TrashInspectionModel;
            Fraction fraction = message.Fraction;
            Segment segment = message.Segment;
            Installation installation = message.Installation;
            
            int eFormId = fraction.eFormId;
            
            if (createModel.ExtendedInspection)
            {
                var result = await _dbContext.PluginConfigurationValues.SingleOrDefaultAsync(x => x.Name == "TrashInspectionBaseSettings:ExtendedInspectioneFormId");
                eFormId = int.Parse(result.Value);
            }
            
            var mainElement = _core.TemplateRead(eFormId);
            if (mainElement == null)
            {
                return;
            }
            List<InstallationSite> installationSites = _dbContext.InstallationSites.Where(x => x.InstallationId == installation.Id && x.WorkflowState != Constants.WorkflowStates.Removed).ToList();
            CultureInfo cultureInfo = new CultureInfo("de-DE");
            List<Task> tasks = new List<Task>();
            foreach (InstallationSite installationSite in installationSites)
            {
                TrashInspectionCase trashInspectionCase = new TrashInspectionCase
                {
                    SegmentId = segment.Id,
                    Status = 0,
                    TrashInspectionId = createModel.Id,
                    SdkSiteId = installationSite.SDKSiteId,
                };

                trashInspectionCase.Create(_dbContext);
                LogEvent("CreateTrashInspection: trashInspectionCase created dispatching TrashInspectionCaseCreated");
                Task sendLocal = _bus.SendLocal(new TrashInspectionCaseCreated(eFormId, trashInspectionCase, createModel, segment,
                    fraction));
                tasks.Add(sendLocal);
                LogEvent("CreateTrashInspection: trashInspectionCase created TrashInspectionCaseCreated dispatched");
            }

            await Task.WhenAll(tasks);

            var trashInspection = await _dbContext.TrashInspections.SingleAsync(x => x.Id == createModel.Id);

            if (trashInspection.Status < 33)
            {
                trashInspection.Status = 33;
                trashInspection.Update(_dbContext);
            }
        }

        private void LogEvent(string appendText)
        {
            try
            {                
                var oldColor = Console.ForegroundColor;
                Console.ForegroundColor = ConsoleColor.Gray;
                Console.WriteLine("[DBG] " + appendText);
                Console.ForegroundColor = oldColor;
            }
            catch
            {
            }
        }

        private void LogException(string appendText)
        {
            try
            {
                var oldColor = Console.ForegroundColor;
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("[ERR] " + appendText);
                Console.ForegroundColor = oldColor;
            }
            catch
            {

            }
        }
    }
}