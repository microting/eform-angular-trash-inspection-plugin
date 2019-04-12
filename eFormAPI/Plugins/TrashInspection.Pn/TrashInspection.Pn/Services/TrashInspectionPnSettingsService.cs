using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using eFormSqlController;
using Microsoft.AspNetCore.Http;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
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
        private readonly IPluginDbOptions<TrashInspectionBaseSettings> _options;
        private readonly string _connectionString;
        private readonly IHttpContextAccessor _httpContextAccessor;


        public TrashInspectionPnSettingsService(ILogger<TrashInspectionPnSettingsService> logger,
            ITrashInspectionLocalizationService trashInspectionLocalizationService,
            TrashInspectionPnDbContext dbContext,
            IPluginDbOptions<TrashInspectionBaseSettings> options,
            IEFormCoreService coreHelper,
            IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _options = options;
            _httpContextAccessor = httpContextAccessor;
            _trashInspectionLocalizationService = trashInspectionLocalizationService;
        }

        public async Task<OperationDataResult<TrashInspectionBaseSettings>> GetSettings()
        {
            try
            {
//                TrashInspectionPnSettingsModel result = new TrashInspectionPnSettingsModel();
//                List<TrashInspectionPnSetting> trashInspectionPnSetting = _dbContext.TrashInspectionPnSettings.ToList();
//                if (trashInspectionPnSetting.Count < 12)
//                {
//                    TrashInspectionPnSettingsModel.SettingCreateDefaults(_dbContext);                    
//                    trashInspectionPnSetting = _dbContext.TrashInspectionPnSettings.AsNoTracking().ToList();
//                }
//                result.trashInspectionSettingsList = new List<TrashInspectionPnSettingModel>();
//                foreach (TrashInspectionPnSetting inspectionPnSetting in trashInspectionPnSetting)
//                {
//                    TrashInspectionPnSettingModel trashInspectionPnSettingModel = new TrashInspectionPnSettingModel();
//                    trashInspectionPnSettingModel.Id = inspectionPnSetting.Id;
//                    trashInspectionPnSettingModel.Name = inspectionPnSetting.Name;
//                    trashInspectionPnSettingModel.Value = inspectionPnSetting.Value;
//                    result.trashInspectionSettingsList.Add(trashInspectionPnSettingModel);
//                }
                var result = _options.Value;

                return new OperationDataResult<TrashInspectionBaseSettings>(true, result);
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<TrashInspectionBaseSettings>(false,
                    _trashInspectionLocalizationService.GetString("ErrorWhileObtainingTrashInspectionSettings"));
            }
        }

        public async Task<OperationResult> UpdateSettings(TrashInspectionBaseSettings trashInspectionSettingsModel)
        {
            try
            {
                await _options.UpdateDb(settings =>
                {
                    settings.Token = trashInspectionSettingsModel.Token;
                    settings.LogLevel = trashInspectionSettingsModel.LogLevel;
                    settings.LogLimit = trashInspectionSettingsModel.LogLimit;
                    settings.MaxParallelism = trashInspectionSettingsModel.MaxParallelism;
                    settings.CallBackUrl = trashInspectionSettingsModel.CallBackUrl;
                    settings.NumberOfWorkers = trashInspectionSettingsModel.NumberOfWorkers;
                    settings.SdkConnectionString = trashInspectionSettingsModel.SdkConnectionString;
                    settings.CallbackCredentialPassword = trashInspectionSettingsModel.CallbackCredentialPassword;
                    settings.CallBackCredentialDomain = trashInspectionSettingsModel.CallBackCredentialDomain;
                    settings.ExtendedInspectioneFormId = trashInspectionSettingsModel.ExtendedInspectioneFormId;
                    settings.CallbackCredentialAuthType = trashInspectionSettingsModel.CallbackCredentialAuthType;
                    settings.CallbackCredentialUserName = trashInspectionSettingsModel.CallbackCredentialUserName;
                }, _dbContext, UserId);
//                TrashInspectionPnSetting trashInspectionPnSetting = _dbContext.TrashInspectionPnSettings.FirstOrDefault();
//                if (trashInspectionPnSetting == null)
//                {
//                foreach (TrashInspectionPnSettingModel trashInspectionPnSettingModel in trashInspectionSettingsModel.trashInspectionSettingsList)
//                {
//                    trashInspectionPnSettingModel.Update(_dbContext);
//                }
//                }
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

        public int UserId
        {
            get
            {
                var value = _httpContextAccessor?.HttpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier);
                return value == null ? 0 : int.Parse(value);
            }
        }
    }
}
