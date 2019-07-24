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
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using eFormCore;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Dto;
using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Models;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Rebus.Handlers;
using TrashInspection.Pn.Infrastructure.Models;
using TrashInspection.Pn.Messages;

namespace TrashInspection.Pn.Handlers
{
    public class TrashInspectionCaseCreatedHandler : IHandleMessages<TrashInspectionCaseCreated>
    {
        private readonly Core _core;
        private readonly TrashInspectionPnDbContext _dbContext;
        
        public TrashInspectionCaseCreatedHandler(Core core, TrashInspectionPnDbContext context)
        {
            _core = core;
            _dbContext = context;
        }
        #pragma warning disable 1998
        public async Task Handle(TrashInspectionCaseCreated message)
        {
            CultureInfo cultureInfo = new CultureInfo("de-DE");
            MainElement mainElement = _core.TemplateRead(message.TemplateId);
            TrashInspectionModel createModel = message.TrashInspectionModel;
            int SDKSiteId = message.TrashInspectionCase.SdkSiteId;
            Segment segment = message.Segment;
            Fraction fraction = message.Fraction;
            TrashInspectionCase trashInspectionCase = message.TrashInspectionCase;

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

            mainElement.PushMessageTitle = mainElement.Label;
            mainElement.PushMessageBody = "";

            if (createModel.MustBeInspected && !createModel.ExtendedInspection)
            {
                mainElement.PushMessageBody += "*** SKAL INSPICERES ***\n";
                cDataValue.InderValue += "<br><br><b>*** SKAL INSPICERES ***</b>";
            }

            if (createModel.ExtendedInspection)
            {
                mainElement.PushMessageBody += "*** LOVPLIGTIG KONTROL ***\n";
                cDataValue.InderValue += "<br><br><b>*** LOVPLIGTIG KONTROL ***</b>";
                mainElement.Color = Constants.CheckListColors.Red;
            }
            
            mainElement.PushMessageBody += $"Vare: {fraction.Name}\n";
            
            if (createModel.Producer.Length > 17)
            {
                mainElement.PushMessageBody += $"Producent: {createModel.Producer.Substring(0,17)}...";
            }
            else
            {
                mainElement.PushMessageBody += $"Producent: {createModel.Producer}";    
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
            
            LogEvent("CreateTrashInspection: Trying to create SDK case");
            string sdkCaseId = _core.CaseCreate(mainElement, "", SDKSiteId);
            LogEvent($"CreateTrashInspection: SDK case created and got id {sdkCaseId}");

            trashInspectionCase.SdkCaseId = sdkCaseId;
            trashInspectionCase.Status = 66;
            trashInspectionCase.Update(_dbContext);

            var trashInspectionCases =
                _dbContext.TrashInspectionCases.Where(x =>
                    x.TrashInspectionId == trashInspectionCase.TrashInspectionId);
            bool allDone = true;
            foreach (TrashInspectionCase inspectionCase in trashInspectionCases)
            {
                if (inspectionCase.Status < 66)
                {
                    allDone = false;
                }
            }

            if (allDone)
            {
                var trashInspection = await _dbContext.TrashInspections.SingleOrDefaultAsync(x =>
                    x.Id == trashInspectionCase.TrashInspectionId);
                if (trashInspection.Status < 66)
                {
                    trashInspection.Status = 66;
                    trashInspection.Update(_dbContext);
                }
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