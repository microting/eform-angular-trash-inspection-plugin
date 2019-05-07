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
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using System.Globalization;
using System.IO;
using System.Xml;
using System.Xml.Linq;
using eFormData;
using Microsoft.AspNetCore.Mvc;
using Rebus.Bus;
using TrashInspection.Pn.Messages;

namespace TrashInspection.Pn.Services
{
    public class TrashInspectionService : ITrashInspectionService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILogger<TrashInspectionService> _logger;
        private readonly TrashInspectionPnDbContext _dbContext;
        private readonly ITrashInspectionLocalizationService _trashInspectionLocalizationService;
        private readonly IRebusService _rebusService;
        private readonly IBus _bus;

        public TrashInspectionService(ILogger<TrashInspectionService> logger,
            TrashInspectionPnDbContext dbContext,
            IEFormCoreService coreHelper,
            ITrashInspectionLocalizationService trashInspectionLocalizationService, IRebusService rebusService)
        {
            _logger = logger;
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _trashInspectionLocalizationService = trashInspectionLocalizationService;
            _rebusService = rebusService;
            _bus = rebusService.GetBus();
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
                    SegmentId = x.SegmentId,
                    MustBeInspected = x.MustBeInspected,
                    Producer = x.Producer,
                    RegistrationNumber = x.RegistrationNumber,
                    Time = x.Time,
                    Transporter = x.Transporter,
//                    TrashFraction = x.TrashFraction,
                    WeighingNumber = x.WeighingNumber,
                    Status = x.Status,
                    Version = x.Version,
                    WorkflowState = x.WorkflowState,
                    ExtendedInspection = x.ExtendedInspection,
                    InspectionDone = x.InspectionDone,
                    FractionId = x.FractionId,
                    IsApproved = x.IsApproved,
                    Comment = x.Comment
//                    InstallationName = 
            }).ToListAsync();

                foreach (TrashInspectionModel trashInspectionModel in trashInspections)
                {
                    Installation installation = await _dbContext.Installations
                        .SingleOrDefaultAsync(y => y.Id == trashInspectionModel.InstallationId);
                    if (installation != null)
                    {
                        trashInspectionModel.InstallationName = installation.Name;
                    }
                     
                    Fraction fraction = await _dbContext.Fractions
                        .SingleOrDefaultAsync(y => y.Id == trashInspectionModel.FractionId);
                    if (fraction != null)
                    {
                        trashInspectionModel.TrashFraction = $"{fraction.ItemNumber} {fraction.Name}";
                    }       
                    Segment segment = await _dbContext.Segments
                        .SingleOrDefaultAsync(y => y.Id == trashInspectionModel.SegmentId);
                    if (segment != null)
                    {
                        trashInspectionModel.Segment = segment.Name;
                    }             
                }
                
                trashInspectionsModel.Total = await _dbContext.TrashInspections.CountAsync();
//                string lookup = $"TrashInspectionSettings:{MachineAreaSettingsEnum.SdkeFormId.ToString()}"; 

//                trashInspectionsModel.Token = _dbContext.PluginConfigurationValues.TrashInspectionPnSettings.SingleOrDefaultAsync(x => x.Name == "token").Result.Value;
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

        public async Task<string> DownloadEFormPdf(string weighingNumber, string token, string fileType)
        {
            TrashInspectionPnSetting trashInspectionSettings =
                await _dbContext.TrashInspectionPnSettings.SingleOrDefaultAsync(x => x.Name == "token");
            LogEvent($"DownloadEFormPdf: weighingNumber is {weighingNumber} token is {token}");
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
                            InspectionDone = x.InspectionDone,
                            SegmentId = x.SegmentId
                        })
                        .FirstOrDefaultAsync(x => x.WeighingNumber == weighingNumber);

                    Fraction fraction = await _dbContext.Fractions.SingleOrDefaultAsync(x => x.ItemNumber == trashInspection.TrashFraction);
                    if (fraction == null)
                    {
                        fraction = await _dbContext.Fractions.SingleOrDefaultAsync(x => x.Name == trashInspection.TrashFraction);
                    }
                    LogEvent($"DownloadEFormPdf: fraction is {fraction.Name}");

                    string segmentName = "";
                    
                    Segment segment = await _dbContext.Segments.SingleOrDefaultAsync(x => x.Id == trashInspection.SegmentId);
                    if (segment != null)
                    {
                        segmentName = segment.Name;
                    }
                    LogEvent($"DownloadEFormPdf: segmentName is {segmentName}");
                    
                    string xmlContent = new XElement("TrashInspection", 
                        new XElement("EakCode", trashInspection.EakCode), 
                        new XElement("Producer", trashInspection.Producer), 
                        new XElement("RegistrationNumber", trashInspection.RegistrationNumber), 
                        new XElement("Transporter", trashInspection.Transporter), 
                        new XElement("WeighingNumber", trashInspection.WeighingNumber),
                        new XElement("Segment", segmentName),
                        new XElement("TrashFraction", $"{fraction.ItemNumber} {fraction.Name}")
                    ).ToString();
                    LogEvent($"DownloadEFormPdf: xmlContent is {xmlContent}");
                    
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


                        LogEvent($"DownloadEFormPdf: caseId is {caseId}, eFormId is {eFormId}");
                        var filePath = core.CaseToPdf(caseId, eFormId.ToString(),
                            DateTime.Now.ToString("yyyyMMddHHmmssffff"),
                            $"{core.GetSdkSetting(Settings.httpServerAddress)}/" + "api/template-files/get-image/", fileType, xmlContent);
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
                    LogException($"DownloadEFormPdf: We got the following exception: {exception.Message}");
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
//            LogEvent($"CreateTrashInspection: createModel is {createModel.ToString()}");
            var pluginConfiguration = await _dbContext.PluginConfigurationValues.SingleOrDefaultAsync(x => x.Name == "TrashInspectionBaseSettings:Token");
            if (pluginConfiguration == null)
            {
                return new OperationResult(false);
            }
            else
            {
                if (createModel.Token == pluginConfiguration.Value && createModel.WeighingNumber != null)
                {
                    if ((_dbContext.TrashInspections.Count(x => x.WeighingNumber == createModel.WeighingNumber) > 0))
                    {
                        var result =
                            _dbContext.TrashInspections.SingleOrDefault(x =>
                                x.WeighingNumber == createModel.WeighingNumber);
                        return new OperationResult(true, result.Id.ToString());
                    }

                    Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection trashInspection =
                        new Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection
                        {
                            WeighingNumber = createModel.WeighingNumber,
                            Date = createModel.Date,
                            Time = createModel.Time,
                            Eak_Code = createModel.EakCode,
                            ExtendedInspection = createModel.ExtendedInspection,
                            RegistrationNumber = createModel.RegistrationNumber,
                            TrashFraction = createModel.TrashFraction,
                            Producer = createModel.Producer,
                            Transporter = createModel.Transporter,
                            MustBeInspected = createModel.MustBeInspected,
                            Status = 33
                        };
                    
                    trashInspection.Create(_dbContext);
                    
                    Segment segment = _dbContext.Segments.FirstOrDefault(x => x.Name == createModel.Segment);
                    Installation installation = 
                        _dbContext.Installations.FirstOrDefault(x => x.Name == createModel.InstallationName);
                    Fraction fraction = 
                        _dbContext.Fractions.FirstOrDefault(x => x.ItemNumber == createModel.TrashFraction);                    

                    LogEvent($"CreateTrashInspection: Segment: {createModel.Segment}, InstallationName: {createModel.InstallationName}, TrashFraction: {createModel.TrashFraction} ");
                    if (segment != null && installation != null && fraction != null)
                    {
                        trashInspection.SegmentId = segment.Id;
                        trashInspection.FractionId = fraction.Id;
                        trashInspection.InstallationId = installation.Id;
                        trashInspection.Update(_dbContext);
                        createModel.SegmentId = segment.Id;
                        createModel.FractionId = fraction.Id;
                        createModel.InstallationId = installation.Id;
                        createModel.Id = trashInspection.Id;
                        
                        _bus.SendLocal(new TrashInspectionReceived(createModel, fraction, segment, installation));
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
            Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection selectedTrashInspection =
                new Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection()
                {
                    Id = updateModel.Id,
                    Date = updateModel.Date,
                    Eak_Code = updateModel.EakCode,
                    InstallationId = updateModel.InstallationId,
                    MustBeInspected = updateModel.MustBeInspected,
                    Producer = updateModel.Producer,
                    RegistrationNumber = updateModel.RegistrationNumber,
                    Time = updateModel.Time,
                    Transporter = updateModel.Transporter,
                    TrashFraction = updateModel.TrashFraction,
                    WeighingNumber = updateModel.WeighingNumber,
                    Status = updateModel.Status,
                    Version = updateModel.Version,
                    WorkflowState = updateModel.WorkflowState,
                    ExtendedInspection = updateModel.ExtendedInspection,
                    InspectionDone = updateModel.InspectionDone
                };
            
            selectedTrashInspection.Update(_dbContext);
            return new OperationResult(true);
        }

        public async Task<OperationResult> DeleteTrashInspection(int trashInspectionId)
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
            _bus.SendLocal(new TrashInspectionDeleted(trashInspection));
            //trashInspection.Delete(_dbContext);
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
                    _bus.SendLocal(new TrashInspectionDeleted(trashInspection));
//                    Core core = _coreHelper.GetCore();
//
//                    List<TrashInspectionCase> trashInspectionCases = _dbContext.TrashInspectionCases.Where(x =>
//                        x.TrashInspectionId == trashInspection.Id).ToList();
//                    
//                    foreach (TrashInspectionCase trashInspectionCase in trashInspectionCases)
//                    {
//                        Case_Dto caseDto = core.CaseLookupMUId(trashInspectionCase.SdkCaseId);
//                        string microtingUId = caseDto.MicrotingUId;
//                        core.CaseDelete(microtingUId);
//                    }
//
//                    trashInspection.InspectionDone = true;
//                    trashInspection.Update(_dbContext);

                    return new OperationResult(true);
                }               

                return new OperationResult(false);                                    
            }

            return new OperationResult(false);
        }
        
        public void LogEvent(string appendText)
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

        public void LogException(string appendText)
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
