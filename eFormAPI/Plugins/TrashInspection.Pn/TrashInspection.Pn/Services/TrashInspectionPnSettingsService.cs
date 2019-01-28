using System;
using System.Diagnostics;
using System.Linq;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;
using eFormCore;
using eFormData;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;

namespace TrashInspection.Pn.Services
{
    public class TrashInspectionPnSettingsService : ITrashInspectionPnSettingsService
    {
        private readonly ILogger<TrashInspectionPnSettingsService> _logger;
        private readonly ITrashInspectionLocalizationService _trashInspectionLocalizationService;
        private readonly TrashInspectionPnDbContext _dbContext;
        private readonly IEFormCoreService _coreHelper;

        public TrashInspectionPnSettingsService(ILogger<TrashInspectionPnSettingsService> logger,
            ITrashInspectionLocalizationService trashInspectionLocalizationService,
            TrashInspectionPnDbContext dbContext,
            IEFormCoreService coreHelper)
        {
            _logger = logger;
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _trashInspectionLocalizationService = trashInspectionLocalizationService;
        }

        public OperationDataResult<TrashInspectionPnSettingsModel> GetSettings()
        {
            try
            {
                TrashInspectionPnSettingsModel result = new TrashInspectionPnSettingsModel();
                TrashInspectionPnSetting trashInspectionPnSetting = _dbContext.TrashInspectionPnSettings.FirstOrDefault();
                if (trashInspectionPnSetting.SelectedeFormId != null)
                {
                    result.SelectedeFormId = (int)trashInspectionPnSetting.SelectedeFormId;
                    result.SelectedeFormName = trashInspectionPnSetting.SelectedeFormName;
                }
                else
                {
                    result.SelectedeFormId = null;
                }
                result.Token = trashInspectionPnSetting.Token;
                return new OperationDataResult<TrashInspectionPnSettingsModel>(true, result);
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<TrashInspectionPnSettingsModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorWhileObtainingTrashInspectionSettings"));
            }
        }

        public OperationResult UpdateSettings(TrashInspectionPnSettingsModel trashInspectionSettingsModel)
        {
            try
            {
                if (trashInspectionSettingsModel.SelectedeFormId == 0)
                {
                    return new OperationResult(true);
                }
                TrashInspectionPnSetting trashInspectionPnSetting = _dbContext.TrashInspectionPnSettings.FirstOrDefault();
                if (trashInspectionPnSetting == null)
                {
                    trashInspectionPnSetting = new TrashInspectionPnSetting()
                    {
                        SelectedeFormId = trashInspectionSettingsModel.SelectedeFormId,
                    };
                    _dbContext.TrashInspectionPnSettings.Add(trashInspectionPnSetting);
                }
                else
                {
                    trashInspectionPnSetting.SelectedeFormId = trashInspectionSettingsModel.SelectedeFormId;
                }

                if (trashInspectionSettingsModel.SelectedeFormId != null)
                {
                    Core core = _coreHelper.GetCore();
                    MainElement template = core.TemplateRead((int)trashInspectionSettingsModel.SelectedeFormId);
                    trashInspectionPnSetting.SelectedeFormName = template.Label;
                }

                trashInspectionPnSetting.Token = trashInspectionSettingsModel.Token;

                _dbContext.SaveChanges();
                return new OperationResult(true,
                    _trashInspectionLocalizationService.GetString("SettingsHaveBeenUpdatedSuccesfully"));
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false, _trashInspectionLocalizationService.GetString("ErrorWhileUpdatingSettings"));
            }
        }
    }
}
