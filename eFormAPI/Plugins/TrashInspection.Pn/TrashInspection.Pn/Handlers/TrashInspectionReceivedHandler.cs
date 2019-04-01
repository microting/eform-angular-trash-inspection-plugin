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
            List<InstallationSite> installationSites = _dbContext.InstallationSites.Where(x => x.InstallationId == installation.Id).ToList();
            CultureInfo cultureInfo = new CultureInfo("de-DE");
            foreach (InstallationSite installationSite in installationSites)
            {
                mainElement.Repeated = 1;
                mainElement.EndDate = DateTime.Now.AddDays(2).ToUniversalTime();
                mainElement.StartDate = DateTime.Now.ToUniversalTime();
                mainElement.CheckListFolderName = segment.SdkFolderId.ToString();
                mainElement.Label = createModel.RegistrationNumber.ToUpper() + ", " + createModel.Producer;
                mainElement.EnableQuickSync = true;
                mainElement.DisplayOrder = (int)Math.Round(DateTime.Now.Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalSeconds) * -1;
                CDataValue cDataValue = new CDataValue();
                cDataValue.InderValue = $"<b>Vejenr:</b> {createModel.WeighingNumber}<br>";
                cDataValue.InderValue += $"<b>Dato:</b> {createModel.Date.ToString("dd-MM-yyyy") + " " + createModel.Time.ToString("T", cultureInfo)}<br>";
                cDataValue.InderValue += $"<b>Fraktion:</b> {fraction.ItemNumber} {fraction.Name}<br>";
                cDataValue.InderValue += $"<b>Transportør:</b> {createModel.Transporter}<br>";
                cDataValue.InderValue += $"<b>Område:</b> {segment.Name}";
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

                _dbContext.TrashInspectionCases.Add(trashInspectionCase);
                await _dbContext.SaveChangesAsync();
            }

            createModel.SegmentId = segment.Id;
            createModel.FractionId = fraction.Id;
            createModel.InstallationId = installation.Id;
            createModel.Status = 66;
            createModel.Update(_dbContext);
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