using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using eFormCore;
using eFormShared;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Extensions;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;
using System.Globalization;
using System.IO;
using eFormData;
using Microsoft.AspNetCore.Mvc;

namespace TrashInspection.Pn.Services
{
    public class TrashInspectionService : ITrashInspectionService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILogger<TrashInspectionService> _logger;
        private readonly TrashInspectionPnDbContext _dbContext;
        private readonly ITrashInspectionLocalizationService _trashInspectionLocalizationService;

        public TrashInspectionService(ILogger<TrashInspectionService> logger,
            TrashInspectionPnDbContext dbContext,
            IEFormCoreService coreHelper,
            ITrashInspectionLocalizationService trashInspectionLocalizationService)
        {
            _logger = logger;
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _trashInspectionLocalizationService = trashInspectionLocalizationService;
        }

        public async Task<OperationDataResult<TrashInspectionsModel>> GetAllTrashInspections(TrashInspectionRequestModel pnRequestModel)
        {
            try
            {
                var trashInspectionsModel = new TrashInspectionsModel();

                IQueryable<Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection> trashInspectionsQuery = _dbContext.TrashInspections.AsQueryable();
                if (!string.IsNullOrEmpty(pnRequestModel.Sort))
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        trashInspectionsQuery = trashInspectionsQuery
                            .CustomOrderByDescending(pnRequestModel.Sort);
                    }
                    else
                    {
                        trashInspectionsQuery = trashInspectionsQuery
                            .CustomOrderBy(pnRequestModel.Sort);
                    }
                }
                else
                {
                    trashInspectionsQuery = _dbContext.TrashInspections
                        .OrderBy(x => x.Id);
                }

                if (pnRequestModel.PageSize != null)
                {
                    trashInspectionsQuery
                        = trashInspectionsQuery
                         .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Skip(pnRequestModel.Offset)
                        .Take((int)pnRequestModel.PageSize);
                }

                List<TrashInspectionModel> trashInspections = await trashInspectionsQuery.Select(x => new TrashInspectionModel()
                {
                    Id = x.Id,
                    Date = x.Date,
                    EakCode = x.Eak_Code,
                    InstallationId = x.InstallationId,
                    MustBeInspected = x.MustBeInspected,
                    Producer = x.Producer,
                    RegistrationNumber = x.RegistrationNumber,
                    Time = x.Time,
                    Transporter = x.Transporter,
                    TrashFraction = x.TrashFraction,
                    WeighingNumber = x.WeighingNumber,
                    Status = x.Status,
                    Version = x.Version,
                    WorkflowState = x.WorkflowState,
                    ExtendedInspection = x.ExtendedInspection,
                    InspectionDone = x.InspectionDone
            }).ToListAsync();

                trashInspectionsModel.Total = await _dbContext.TrashInspections.CountAsync();
                trashInspectionsModel.TrashInspectionList = trashInspections;

                return new OperationDataResult<TrashInspectionsModel>(true, trashInspectionsModel);
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<TrashInspectionsModel>(false, 
                    _trashInspectionLocalizationService.GetString("ErrorObtainingTrashInspections"));

            }
        }

        public async Task<OperationDataResult<TrashInspectionModel>> GetSingleTrashInspection(int trashInspectionId)
        {
            try
            {
                var trashInspection = await _dbContext.TrashInspections.Select(x => new TrashInspectionModel()
                {
                    Id = x.Id,
                    Date = x.Date,
                    EakCode = x.Eak_Code,
                    InstallationId = x.InstallationId,
                    MustBeInspected = x.MustBeInspected,
                    Producer = x.Producer,
                    RegistrationNumber = x.RegistrationNumber,
                    Time = x.Time,
                    Transporter = x.Transporter,
                    TrashFraction = x.TrashFraction,
                    WeighingNumber = x.WeighingNumber,
                    Status = x.Status,
                    Version = x.Version,
                    WorkflowState = x.WorkflowState,
                    ExtendedInspection = x.ExtendedInspection,
                    InspectionDone = x.InspectionDone
                })
                .FirstOrDefaultAsync(x => x.Id == trashInspectionId);

                if (trashInspection == null)
                {
                    return new OperationDataResult<TrashInspectionModel>(false,
                        _trashInspectionLocalizationService.GetString($"TrashInspectionWithID:{trashInspectionId}DoesNotExist"));
                }

                return new OperationDataResult<TrashInspectionModel>(true, trashInspection);
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<TrashInspectionModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingTrashInspection"));
            }
        }

        public async Task<string> DownloadEFormPdf(string weighingNumber, string token)
        {
            TrashInspectionPnSetting trashInspectionSettings =
                await _dbContext.TrashInspectionPnSettings.SingleOrDefaultAsync(x => x.Name == "token");
            if (token == trashInspectionSettings.Value && weighingNumber != null)
            {
                try
                {
                    var core = _coreHelper.GetCore();
                    string microtingUId;
                    string microtingCheckUId;
                    int caseId = 0;
                    int eFormId = 0;
                    var trashInspection = await _dbContext.TrashInspections.Select(x => new TrashInspectionModel()
                        {
                            Id = x.Id,
                            Date = x.Date,
                            EakCode = x.Eak_Code,
                            InstallationId = x.InstallationId,
                            MustBeInspected = x.MustBeInspected,
                            Producer = x.Producer,
                            RegistrationNumber = x.RegistrationNumber,
                            Time = x.Time,
                            Transporter = x.Transporter,
                            TrashFraction = x.TrashFraction,
                            WeighingNumber = x.WeighingNumber,
                            Status = x.Status,
                            Version = x.Version,
                            WorkflowState = x.WorkflowState,
                            ExtendedInspection = x.ExtendedInspection,
                            InspectionDone = x.InspectionDone
                        })
                        .FirstOrDefaultAsync(x => x.WeighingNumber == weighingNumber);
                    
                    foreach (TrashInspectionCase trashInspectionCase in _dbContext.TrashInspectionCases.Where(x => x.TrashInspectionId == trashInspection.Id).ToList())
                    {
                        if (trashInspectionCase.Status == 100)
                        {
                            Case_Dto caseDto = core.CaseLookupMUId(trashInspectionCase.SdkCaseId);
                            microtingUId = caseDto.MicrotingUId;
                            microtingCheckUId = caseDto.CheckUId;
                            caseId = (int)caseDto.CaseId;
                            eFormId = caseDto.CheckListId;
                        }
                        }

                    if (caseId != 0 && eFormId != 0)
                    {
                        var filePath = core.CaseToPdf(caseId, eFormId.ToString(),
                            DateTime.Now.ToString("yyyyMMddHHmmssffff"),
                            $"{core.GetSdkSetting(Settings.httpServerAddress)}/" + "api/template-files/get-image/");
                        if (!System.IO.File.Exists(filePath))
                        {
                            throw new FileNotFoundException();
                        }

                        return filePath;
                    }
                    else
                    {
                        throw new Exception("could not find case of eform!");
                    }
                    
                }
                catch (Exception exception)
                {
                    throw new Exception("Something went wrong!", exception);
                }
            }
            else
            {
                throw new UnauthorizedAccessException();
            }
        }

        public async Task<OperationResult> CreateTrashInspection(TrashInspectionModel createModel)
        {
            TrashInspectionPnSetting trashInspectionSettings = await _dbContext.TrashInspectionPnSettings.SingleOrDefaultAsync(x => x.Name == "token");
            if (trashInspectionSettings == null)
            {
                return new OperationResult(false);
            }
            else
            {
                if (createModel.Token == trashInspectionSettings.Value && createModel.WeighingNumber != null)
                {
                    if ((_dbContext.TrashInspections.Count(x => x.WeighingNumber == createModel.WeighingNumber) > 0))
                    {
                        return new OperationResult(true);
                    } 
                    
                    createModel.Status = 33;
                    createModel.Save(_dbContext);

                    Segment segment = await _dbContext.Segments.FirstOrDefaultAsync(x => x.Name == createModel.Segment);
                    Installation installation = await
                        _dbContext.Installations.FirstOrDefaultAsync(x => x.Name == createModel.InstallationName);
                    Fraction fraction = await
                        _dbContext.Fractions.FirstOrDefaultAsync(x => x.Name == createModel.TrashFraction);

                    if (segment != null && installation != null && fraction != null)
                    {
                        Core core = _coreHelper.GetCore();

                        var mainElement = core.TemplateRead(fraction.eFormId);
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
                            cDataValue.InderValue = "<b>Vejenr:</b> " + createModel.WeighingNumber + "<br>";
                            cDataValue.InderValue += "<b>Dato:</b> " + createModel.Date.ToString("dd-MM-yyyy") + " " + createModel.Time.ToString("T", cultureInfo) + "<br>";
                            cDataValue.InderValue += "<b>Fraktion:</b> " + createModel.TrashFraction + "<br>";
                            cDataValue.InderValue += "<b>Transportør:</b> " + createModel.Transporter;
                            if (createModel.MustBeInspected)
                            {
                                cDataValue.InderValue += "<br><br><b>*** SKAL INSPICERES ***</b>";
                            }
                            mainElement.ElementList[0].Description = cDataValue;
                            mainElement.ElementList[0].Label = mainElement.Label;
                            DataElement dataElement = (DataElement)mainElement.ElementList[0];
                            dataElement.DataItemList[0].Label = mainElement.Label;
                            dataElement.DataItemList[0].Description = cDataValue;
                            if (createModel.MustBeInspected)
                            {
                                dataElement.DataItemList[0].Color = Constants.FieldColors.Red;
                            }

                            string sdkCaseId = core.CaseCreate(mainElement, "", installationSite.SDKSiteId);
                            
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
                    
                    return new OperationResult(true, createModel.Id.ToString());
            }
            else
            {
                    
                return new OperationResult(false);
            }
                
            }
            
            
                
        }

        public async Task<OperationResult> UpdateTrashInspection(TrashInspectionModel updateModel)
        {
            updateModel.Update(_dbContext);
            return new OperationResult(true);
        }

        public async Task<OperationResult> DeleteTrashInspection(int trashInspectionId)
        {
            TrashInspectionModel trashInspection = new TrashInspectionModel();
            trashInspection.Id = trashInspectionId;
            trashInspection.Delete(_dbContext);
            return new OperationResult(true);

        }

        public async Task<OperationResult> DeleteTrashInspection(string weighingNumber, string token)
        {
            TrashInspectionPnSetting trashInspectionSettings = await _dbContext.TrashInspectionPnSettings.SingleOrDefaultAsync(x => x.Name == "token");
            
            if (trashInspectionSettings == null)
            {
                return new OperationResult(false, "Unauthorized Access");
            }

            if (token != trashInspectionSettings.Value)
            {
                return new OperationResult(false, "Unauthorized Access");
            }
            
            if (weighingNumber != null)
            {
                var trashInspection = await _dbContext.TrashInspections.Select(x => new TrashInspectionModel()
                    {
                        Id = x.Id,
                        Date = x.Date,
                        EakCode = x.Eak_Code,
                        InstallationId = x.InstallationId,
                        MustBeInspected = x.MustBeInspected,
                        Producer = x.Producer,
                        RegistrationNumber = x.RegistrationNumber,
                        Time = x.Time,
                        Transporter = x.Transporter,
                        TrashFraction = x.TrashFraction,
                        WeighingNumber = x.WeighingNumber,
                        Status = x.Status,
                        Version = x.Version,
                        WorkflowState = x.WorkflowState,
                        ExtendedInspection = x.ExtendedInspection,
                        InspectionDone = x.InspectionDone
                    })
                    .FirstOrDefaultAsync(x => x.WeighingNumber == weighingNumber);

                if (trashInspection != null)
                {
                    Core core = _coreHelper.GetCore();

                    List<TrashInspectionCase> trashInspectionCases = _dbContext.TrashInspectionCases.Where(x =>
                        x.TrashInspectionId == trashInspection.Id).ToList();
                    
                    foreach (TrashInspectionCase trashInspectionCase in trashInspectionCases)
                    {
                        Case_Dto caseDto = core.CaseLookupMUId(trashInspectionCase.SdkCaseId);
                        string microtingUId = caseDto.MicrotingUId;
                        core.CaseDelete(microtingUId);
                    }

                    trashInspection.InspectionDone = true;
                    trashInspection.Update(_dbContext);

                    return new OperationResult(true);
                }               

                return new OperationResult(false);                                    
            }

            return new OperationResult(false);
        }
    }
}
