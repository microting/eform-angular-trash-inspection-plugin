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
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Extensions;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using System.IO;
using System.Xml.Linq;
using eFormCore;
using Microting.eForm.Dto;
using Microting.eForm.Infrastructure.Constants;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
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

        public async Task<OperationDataResult<TrashInspectionsModel>> Index(TrashInspectionRequestModel pnRequestModel)
        {
            try
            {
                
                PluginConfigurationValue trashInspectionSettings =
                    await _dbContext.PluginConfigurationValues.SingleOrDefaultAsync(x => x.Name == "TrashInspectionBaseSettings:Token");

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
                    WeighingNumber = x.WeighingNumber,
                    Status = x.Status,
                    Version = x.Version,
                    WorkflowState = x.WorkflowState,
                    ExtendedInspection = x.ExtendedInspection,
                    InspectionDone = x.InspectionDone,
                    FractionId = x.FractionId,
                    IsApproved = x.IsApproved,
                    Comment = x.Comment,
                    Token = trashInspectionSettings.Value
                }).ToListAsync();
                
                Core _core = await _coreHelper.GetCore();
                List<KeyValuePair<int, int>> eFormIds = new List<KeyValuePair<int, int>>(); // <FractionId, eFormId>

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

                    if (trashInspectionModel.Status == 100)
                    {
                        trashInspectionModel.SdkCaseId = int.Parse(
                            _dbContext.TrashInspectionCases.SingleOrDefault(x =>
                                x.TrashInspectionId == trashInspectionModel.Id)
                                ?.SdkCaseId);
                        trashInspectionModel.SdkCaseId = (int)_core.CaseLookupMUId(trashInspectionModel.SdkCaseId).Result.CaseId;
                        if (eFormIds.Any(x => x.Key == trashInspectionModel.FractionId))
                        {
                            trashInspectionModel.SdkeFormId = eFormIds.First(x => x.Key == trashInspectionModel.FractionId).Value;
                        }
                        else
                        {
                            try
                            {
                                int eFormName = _core.TemplateItemRead(fraction.eFormId).Result.Id;
                                trashInspectionModel.SdkeFormId = eFormName;
                                KeyValuePair<int, int> kvp =
                                    new KeyValuePair<int, int>(fraction.eFormId, eFormName);
                                eFormIds.Add(kvp);
                            }
                            catch
                            {
//                                KeyValuePair<int, int> kvp = new KeyValuePair<int, int>(fraction.eFormId, "");
//                                eFormIds.Add(kvp);
                            }
                        }
                    }
                }

                TrashInspectionsModel trashInspectionsModel = new TrashInspectionsModel
                {
                    Total = await _dbContext.TrashInspections.CountAsync(), TrashInspectionList = trashInspections
                };


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
        
        public async Task<OperationDataResult<TrashInspectionCaseVersionsModel>> IndexVersions(
            int trashInspectionId)
        {
            try
            {
                var trashInspectionCaseVersionsModel = new TrashInspectionCaseVersionsModel();
            
                var trashInspectionCaseVersionsQuery = _dbContext.TrashInspectionCaseVersions.AsQueryable();

                List<TrashInspectionCaseVersion> trashInspectionCaseVersions = await trashInspectionCaseVersionsQuery
                    .Where(x => x.TrashInspectionId == trashInspectionId).ToListAsync();

                trashInspectionCaseVersionsModel.Total = trashInspectionCaseVersions.Count;
                trashInspectionCaseVersionsModel.TrashInspectionCaseVersionList = trashInspectionCaseVersions;
                if (trashInspectionCaseVersions == null)
                {
                    return new OperationDataResult<TrashInspectionCaseVersionsModel>(false,
                        _trashInspectionLocalizationService.GetString($"TrashInspectionWithID:{trashInspectionId}DoesNotExist"));
                }
                
                return new OperationDataResult<TrashInspectionCaseVersionsModel>(true, trashInspectionCaseVersionsModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<TrashInspectionCaseVersionsModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingTrashInspection"));
            }
        }
        

        public async Task<OperationResult> Create(TrashInspectionModel createModel)
        {
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
                            InspectionDone = false,
                            Status = 0
                        };
                    
                    await trashInspection.Create(_dbContext);
                    
                    Segment segment = _dbContext.Segments.FirstOrDefault(x => x.Name == createModel.Segment);
                    Installation installation = 
                        _dbContext.Installations.FirstOrDefault(x => x.Name == createModel.InstallationName);
                    Fraction fraction = 
                        _dbContext.Fractions.FirstOrDefault(x => x.ItemNumber == createModel.TrashFraction);                    

                    _coreHelper.LogEvent($"CreateTrashInspection: Segment: {createModel.Segment}, InstallationName: {createModel.InstallationName}, TrashFraction: {createModel.TrashFraction} ");
                    if (segment != null && installation != null && fraction != null)
                    {
                        trashInspection.SegmentId = segment.Id;
                        trashInspection.FractionId = fraction.Id;
                        trashInspection.InstallationId = installation.Id;
                        await trashInspection.Update(_dbContext);
                        createModel.SegmentId = segment.Id;
                        createModel.FractionId = fraction.Id;
                        createModel.InstallationId = installation.Id;
                        createModel.Id = trashInspection.Id;
                        
                        await UpdateProducerAndTransporter(trashInspection, createModel);
                        
                        await _bus.SendLocal(new TrashInspectionReceived(createModel, fraction, segment, installation));
                    }
                    
                    return new OperationResult(true, createModel.Id.ToString());
                }
                else
                {
                    
                    return new OperationResult(false);
                }
                
            }
                
        }
        
        public async Task<OperationDataResult<TrashInspectionModel>> Read(int trashInspectionId)
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

        public async Task<OperationDataResult<TrashInspectionModel>> Read(string weighingNumber, string token)
        {
            PluginConfigurationValue trashInspectionSettings =
                await _dbContext.PluginConfigurationValues.SingleOrDefaultAsync(x => x.Name == "TrashInspectionBaseSettings:Token");
            _coreHelper.LogEvent($"DownloadEFormPdf: weighingNumber is {weighingNumber} token is {token}");
            if (token == trashInspectionSettings.Value && weighingNumber != null)
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
                            RegistrationNumber = x.RegistrationNumber,
                            Time = x.Time,
                            WeighingNumber = x.WeighingNumber,
                            Status = x.Status,
                            Version = x.Version,
                            ExtendedInspection = x.ExtendedInspection,
                            InspectionDone = x.InspectionDone,
                            IsApproved = x.IsApproved,
                            Comment = x.Comment
                        })
                        .FirstOrDefaultAsync(x => x.WeighingNumber == weighingNumber);

                    if (trashInspection == null)
                    {
                        return new OperationDataResult<TrashInspectionModel>(false,
                            _trashInspectionLocalizationService.GetString($"WeighingNumber:{weighingNumber}DoesNotExist"));
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
            else
            {
                throw new UnauthorizedAccessException();
            }
        }
        
        public async Task<OperationDataResult<TrashInspectionVersionsModel>> ReadVersion(int trashInspectionId)
        {
            try
            {
                TrashInspectionVersionsModel trashInspectionVersionsModel = new TrashInspectionVersionsModel
                {
                    TrashInspectionId = trashInspectionId
                };

                var trashInspectionVersionsQuery = _dbContext.TrashInspectionVersions.AsQueryable();

                List<TrashInspectionVersion> trashInspectionVersions =
                    await trashInspectionVersionsQuery.Where(x => x.TrashInspectionId == trashInspectionId).ToListAsync();

                trashInspectionVersionsModel.TrashInspectionVersionList = new List<TrashInspectionVersionModel>();
                
                foreach (TrashInspectionVersion trashInspectionVersion in trashInspectionVersions)
                {
                    TrashInspectionVersionModel trashInspectionVersionModel = new TrashInspectionVersionModel
                    {
                        Id = trashInspectionVersion.Id,
                        UpdatedAt = (DateTime)trashInspectionVersion.UpdatedAt,
                        Version = trashInspectionVersion.Version,
                        WeighingNumber = trashInspectionVersion.WeighingNumber,
                        Date = trashInspectionVersion.Date,
                        Time = trashInspectionVersion.Time,
                        RegistrationNumber = trashInspectionVersion.RegistrationNumber,
                        TrashFraction = trashInspectionVersion.TrashFraction,
                        FractionId = trashInspectionVersion.FractionId,
                        EakCode = trashInspectionVersion.EakCode,
                        Producer = trashInspectionVersion.Producer,
                        Transporter = trashInspectionVersion.Transporter,
                        InstallationId = trashInspectionVersion.InstallationId,
                        MustBeInspected = trashInspectionVersion.MustBeInspected,
                        Status = trashInspectionVersion.Status,
                        TrashInspectionId = trashInspectionVersion.TrashInspectionId,
                        SegmentId = trashInspectionVersion.SegmentId,
                        ExtendedInspection = trashInspectionVersion.ExtendedInspection,
                        InspectionDone = trashInspectionVersion.InspectionDone,
                        IsApproved = trashInspectionVersion.IsApproved,
                        ApprovedValue = trashInspectionVersion.ApprovedValue,
                        Comment = trashInspectionVersion.Comment,
                        ProducerId = trashInspectionVersion.ProducerId,
                        TransporterId = trashInspectionVersion.TransporterId,
                        FirstWeight = trashInspectionVersion.FirstWeight,
                        SecondWeight = trashInspectionVersion.SecondWeight
                    };
                    trashInspectionVersionsModel.TrashInspectionVersionList.Add(trashInspectionVersionModel);
                }
                
                foreach (TrashInspectionVersionModel trashInspectionVersionModel in trashInspectionVersionsModel.TrashInspectionVersionList)
                {
                    Installation installation = await _dbContext.Installations
                        .SingleOrDefaultAsync(y => y.Id == trashInspectionVersionModel.InstallationId);
                    if (installation != null)
                    {
                        trashInspectionVersionModel.InstallationName = installation.Name;
                    }
                     
                    Fraction fraction = await _dbContext.Fractions
                        .SingleOrDefaultAsync(y => y.Id == trashInspectionVersionModel.FractionId);
                    if (fraction != null)
                    {
                        trashInspectionVersionModel.TrashFraction = $"{fraction.ItemNumber} {fraction.Name}";
                    }       
                    Segment segment = await _dbContext.Segments
                        .SingleOrDefaultAsync(y => y.Id == trashInspectionVersionModel.SegmentId);
                    if (segment != null)
                    {
                        trashInspectionVersionModel.Segment = segment.Name;
                    }             
                }

                var trashInspectionCaseQuery = _dbContext.TrashInspectionCases.AsQueryable();

                 List<TrashInspectionCase> trashInspectionCases = await trashInspectionCaseQuery
                     .Where(x => x.TrashInspectionId == trashInspectionId).ToListAsync();

                 var statusModels = new List<TrashInspectionCaseStatusModel>();
                 foreach (var trashInspectionCase in trashInspectionCases)
                 {
                     TrashInspectionCaseStatusModel trashInspectionCaseStatusModel = new TrashInspectionCaseStatusModel();

                     trashInspectionCaseStatusModel.SdkSiteId = trashInspectionCase.SdkSiteId;
                     try
                     {
                         trashInspectionCaseStatusModel.SdkSiteName =
                             _coreHelper.GetCore().Result.Advanced_SiteItemRead(trashInspectionCase.SdkSiteId).Result.SiteName;
                     }
                     catch (Exception ex)
                     {
                         Trace.TraceError(ex.Message);
                         
                     }
                     
                     trashInspectionCaseStatusModel.Status = trashInspectionCase.Status;

                     var lists = await _dbContext.TrashInspectionCaseVersions.Where(x =>
                         x.TrashInspectionCaseId == trashInspectionCase.Id).ToListAsync();
                     foreach (var trashInspectionCaseVersion in lists)
                     {
                         switch (trashInspectionCaseVersion.Status)
                         {
                             case 0:
                                 trashInspectionCaseStatusModel.CreatedLocally = trashInspectionCaseVersion.UpdatedAt; 
                                 break;
                             case 66:
                             {
                                 if (trashInspectionCaseVersion.WorkflowState == Constants.WorkflowStates.Removed)
                                 {
                                     trashInspectionCaseStatusModel.Removed = trashInspectionCaseVersion.UpdatedAt;
                                 }
                                 else
                                 {
                                     trashInspectionCaseStatusModel.SentToMicroting = trashInspectionCaseVersion.UpdatedAt;
                                 } 
                                 break;
                             }
                             case 70:
                             {
                                 trashInspectionCaseStatusModel.ReadyAtMicroting = trashInspectionCaseVersion.UpdatedAt; 
                                 break;
                             }
                             case 77:
                             {
                                 trashInspectionCaseStatusModel.ReceivedOnTablet = trashInspectionCaseVersion.UpdatedAt; 
                                 break;
                             }
                             case 100:
                             {
                                 trashInspectionCaseStatusModel.Answered = trashInspectionCaseVersion.UpdatedAt; 
                                 break;
                             }
                         }
                     }
                     statusModels.Add(trashInspectionCaseStatusModel);
                 trashInspectionVersionsModel.TrashInspectionCaseStatusModels = statusModels;

                 }

                 return new OperationDataResult<TrashInspectionVersionsModel>(true, trashInspectionVersionsModel);


            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<TrashInspectionVersionsModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingTrashInspection"));
            }
        }
        public async Task<OperationResult> Update(TrashInspectionModel updateModel)
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
            
            await selectedTrashInspection.Update(_dbContext);
            return new OperationResult(true);
        }

        public async Task<OperationResult> Delete(int trashInspectionId)
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
            await _bus.SendLocal(new TrashInspectionDeleted(trashInspection));
            //trashInspection.Delete(_dbContext);
            return new OperationResult(true);

        }

        public async Task<OperationResult> Delete(string weighingNumber, string token)
        {
            PluginConfigurationValue trashInspectionSettings =
                await _dbContext.PluginConfigurationValues.SingleOrDefaultAsync(x => x.Name == "TrashInspectionBaseSettings:Token");
            
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
                    await _bus.SendLocal(new TrashInspectionDeleted(trashInspection));

                    return new OperationResult(true);
                }               

                return new OperationResult(false);                                    
            }

            return new OperationResult(false);
        }

        
        public async Task<string> DownloadEFormPdf(string weighingNumber, string token, string fileType)
        {
            PluginConfigurationValue trashInspectionSettings =
                await _dbContext.PluginConfigurationValues.SingleOrDefaultAsync(x => x.Name == "TrashInspectionBaseSettings:Token");
            _coreHelper.LogEvent($"DownloadEFormPdf: weighingNumber is {weighingNumber} token is {token}");
            if (token == trashInspectionSettings.Value && weighingNumber != null)
            {
                try
                {
                    var core = await _coreHelper.GetCore();
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
                    _coreHelper.LogEvent($"DownloadEFormPdf: fraction is {fraction.Name}");

                    string segmentName = "";
                    
                    Segment segment = await _dbContext.Segments.SingleOrDefaultAsync(x => x.Id == trashInspection.SegmentId);
                    if (segment != null)
                    {
                        segmentName = segment.Name;
                    }
                    _coreHelper.LogEvent($"DownloadEFormPdf: segmentName is {segmentName}");
                    
                    string xmlContent = new XElement("TrashInspection", 
                        new XElement("EakCode", trashInspection.EakCode), 
                        new XElement("Producer", trashInspection.Producer), 
                        new XElement("RegistrationNumber", trashInspection.RegistrationNumber), 
                        new XElement("Transporter", trashInspection.Transporter), 
                        new XElement("WeighingNumber", trashInspection.WeighingNumber),
                        new XElement("Segment", segmentName),
                        new XElement("TrashFraction", $"{fraction.ItemNumber} {fraction.Name}")
                    ).ToString();
                    _coreHelper.LogEvent($"DownloadEFormPdf: xmlContent is {xmlContent}");
                    
                    foreach (TrashInspectionCase trashInspectionCase in _dbContext.TrashInspectionCases.Where(x => x.TrashInspectionId == trashInspection.Id).ToList())
                    {
                        if (trashInspectionCase.Status == 100)
                        {
                            CaseDto caseDto = await core.CaseLookupMUId(int.Parse(trashInspectionCase.SdkCaseId));
                            microtingUId = caseDto.MicrotingUId.ToString();
                            microtingCheckUId = caseDto.CheckUId.ToString();
                            caseId = (int)caseDto.CaseId;
                            eFormId = caseDto.CheckListId;
                        }
                    }

                    if (caseId != 0 && eFormId != 0)
                    {


                        _coreHelper.LogEvent($"DownloadEFormPdf: caseId is {caseId}, eFormId is {eFormId}");
                        var filePath = await core.CaseToPdf(caseId, eFormId.ToString(),
                            DateTime.Now.ToString("yyyyMMddHHmmssffff"),
                            $"{await core.GetSdkSetting(Settings.httpServerAddress)}/" + "api/template-files/get-image/", fileType, xmlContent);
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
                    _coreHelper.LogException($"DownloadEFormPdf: We got the following exception: {exception.Message}");
                    throw new Exception("Something went wrong!", exception);
                }
            }
            else
            {
                throw new UnauthorizedAccessException();
            }
        }
        private async Task UpdateProducerAndTransporter(Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection trashInspection, TrashInspectionModel createModel)
        {
            var producer = _dbContext.Producers.SingleOrDefault(x => x.Name == createModel.Producer);

            if (producer == null)
            {
                producer = new Producer
                {
                    Name = createModel.Producer,
                    Address = createModel.ProducerAddress,
                    City = createModel.ProducerCity,
                    ContactPerson = createModel.ProducerContact,
                    Phone = createModel.ProducerPhone,
                    ZipCode = createModel.ProducerZip,
                    ForeignId = createModel.ProducerForeignId
                };
                
                await producer.Create(_dbContext);
            }
            else
            {
                producer.Address = createModel.ProducerAddress;
                producer.City = createModel.ProducerCity;
                producer.ContactPerson = createModel.ProducerContact;
                producer.Phone = createModel.ProducerPhone;
                producer.ZipCode = createModel.ProducerZip;
                producer.ForeignId = createModel.ProducerForeignId;
                await producer.Update(_dbContext);
            }

            trashInspection.ProducerId = producer.Id;

            var transporter = _dbContext.Transporters.SingleOrDefault(x => x.Name == createModel.Transporter);

            if (transporter == null)
            {
                transporter = new Transporter
                {
                    Name = createModel.Transporter,
                    Address = createModel.TransporterAddress,
                    City = createModel.TransporterCity,
                    ZipCode = createModel.TransporterZip,
                    Phone = createModel.TransporterPhone,
                    ContactPerson = createModel.TransporterContact,
                    ForeignId = createModel.TransporterForeignId
                };
                
                await transporter.Create(_dbContext);
            }
            else
            {
                transporter.Address = createModel.TransporterAddress;
                transporter.City = createModel.TransporterCity;
                transporter.ZipCode = createModel.TransporterZip;
                transporter.Phone = createModel.TransporterPhone;
                transporter.ContactPerson = createModel.TransporterContact;
                transporter.ForeignId = createModel.TransporterForeignId;
                await transporter.Update(_dbContext);
            }

            trashInspection.TransporterId = transporter.Id;

            await trashInspection.Update(_dbContext);
        }
    }
}
