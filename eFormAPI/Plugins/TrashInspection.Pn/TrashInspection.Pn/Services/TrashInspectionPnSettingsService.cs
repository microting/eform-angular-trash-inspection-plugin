using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
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
using Microting.eFormTrashInspectionBase.Infrastructure.Data;

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
                var option = _options.Value;
                if (option.Token == "...")
                {
                    string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                    Random random = new Random();
                    string result = new string(chars.Select(c => chars[random.Next(chars.Length)]).Take(32).ToArray());
                    await _options.UpdateDb(settings => { settings.Token = result;}, _dbContext, UserId);
                }

                if (option.SdkConnectionString == "...")
                {
                    string connectionString = _dbContext.Database.GetDbConnection().ConnectionString;

                    string dbNameSection = Regex.Match(connectionString, @"(Database=(...)_eform-angular-\w*-plugin;)").Groups[0].Value;
                    string dbPrefix = Regex.Match(connectionString, @"Database=(\d*)_").Groups[1].Value;
                    string sdk = $"Database={dbPrefix}_SDK;";
                    connectionString = connectionString.Replace(dbNameSection, sdk);
                    await _options.UpdateDb(settings => { settings.SdkConnectionString = connectionString;}, _dbContext, UserId);

                }

                return new OperationDataResult<TrashInspectionBaseSettings>(true, option);
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

                return new OperationResult(true,
                    _trashInspectionLocalizationService.GetString("SettingsHaveBeenUpdatedSuccessfully"));
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
