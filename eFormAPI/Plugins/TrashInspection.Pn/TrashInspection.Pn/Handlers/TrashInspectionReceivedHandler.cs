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
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Rebus.Handlers;
using TrashInspection.Pn.Messages;
using eFormCore;
using eFormData;
using eFormShared;
using Microsoft.EntityFrameworkCore;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Handlers
{
    public class TrashInspectionReceivedHandler : IHandleMessages<TrashInspectionReceived>
    {
        private readonly Core _core;
        private readonly TrashInspectionPnDbContext _dbContext;
        
        public TrashInspectionReceivedHandler(Core core, TrashInspectionPnDbContext context)
        {
            _core = core;
            _dbContext = context;
        }
        
        #pragma warning disable 1998
        public async Task Handle(TrashInspectionReceived message)
        {

            TrashInspectionModel createModel = message.TrashInspectionModel;
            Fraction fraction = message.Fraction;
            Segment segment = message.Segment;
            Installation installation = message.Installation;
            
            int eFormId = fraction.eFormId;
            
            if (createModel.ExtendedInspection)
            {
                var result = await _dbContext.TrashInspectionPnSettings.SingleOrDefaultAsync(x =>
                    x.Name == "ExtendedInspectioneFormId");
                eFormId = int.Parse(result.Value);
            }
            
            var mainElement = _core.TemplateRead(eFormId);
            if (mainElement == null)
            {
                return;
            }
            List<InstallationSite> installationSites = _dbContext.InstallationSites.Where(x => x.InstallationId == installation.Id).ToList();
            CultureInfo cultureInfo = new CultureInfo("de-DE");
            foreach (InstallationSite installationSite in installationSites)
            {
                mainElement.Repeated = 1;
                mainElement.EndDate = DateTime.Now.AddDays(2).ToUniversalTime();
                mainElement.StartDate = DateTime.Now.ToUniversalTime();
                mainElement.CheckListFolderName = segment.SdkFolderId.ToString();
                mainElement.Label = createModel.RegistrationNumber.ToUpper() + ", " + createModel.Transporter;
                mainElement.EnableQuickSync = true;
                mainElement.DisplayOrder = (int)Math.Round(DateTime.Now.Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalSeconds) * -1;
                CDataValue cDataValue = new CDataValue();
                cDataValue.InderValue = $"<b>Vejenr:</b> {createModel.WeighingNumber}<br>";
                cDataValue.InderValue += $"<b>Dato:</b> {createModel.Date.ToString("dd-MM-yyyy") + " " + createModel.Time.ToString("T", cultureInfo)}<br>";
                cDataValue.InderValue += $"<b>Område:</b> {segment.Name}<br>";
                cDataValue.InderValue += $"<b>Producent:</b> {createModel.Producer}<br>";
                cDataValue.InderValue += $"<b>Varenummer:</b> {fraction.ItemNumber} {fraction.Name}";
                if (createModel.MustBeInspected)
                {
                    cDataValue.InderValue += "<br><br><b>*** SKAL INSPICERES ***</b>";
                }

                if (createModel.ExtendedInspection)
                {
                    cDataValue.InderValue += "<br><br><b>*** LOVPLIGTIG KONTROL ***</b>";
                }
                mainElement.ElementList[0].Description = cDataValue;
                mainElement.ElementList[0].Label = mainElement.Label;
                DataElement dataElement = (DataElement)mainElement.ElementList[0];
                dataElement.DataItemList[0].Label = mainElement.Label;
                dataElement.DataItemList[0].Description = cDataValue;
                
                if (createModel.MustBeInspected || createModel.ExtendedInspection)
                {
                    dataElement.DataItemList[0].Color = Constants.FieldColors.Red;
                }
                
                LogEvent("CreateTrashInspection: Trying to create case");
                string sdkCaseId = _core.CaseCreate(mainElement, "", installationSite.SDKSiteId);
                
                TrashInspectionCase trashInspectionCase = new TrashInspectionCase();
                trashInspectionCase.SegmentId = segment.Id;
                trashInspectionCase.Status = 66;
                trashInspectionCase.TrashInspectionId = createModel.Id;
                trashInspectionCase.SdkCaseId = sdkCaseId;
                trashInspectionCase.SdkSiteId = installationSite.SDKSiteId;
                trashInspectionCase.CreatedAt = DateTime.Now;
                trashInspectionCase.UpdatedAt = DateTime.Now;
                trashInspectionCase.Version = 1;
                trashInspectionCase.WorkflowState = Constants.WorkflowStates.Created;

                _dbContext.TrashInspectionCases.Add(trashInspectionCase);
                
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

            var trashInspection = await _dbContext.TrashInspections.SingleAsync(x => x.Id == createModel.Id);

            if (trashInspection.Status < 66)
            {
                createModel.Status = 66;
                await createModel.Update(_dbContext);
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