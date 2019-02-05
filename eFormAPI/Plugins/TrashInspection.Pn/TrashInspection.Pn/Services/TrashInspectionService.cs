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
                    trashInspectionsQuery = trashInspectionsQuery
                        .Skip(pnRequestModel.Offset)
                        .Take((int)pnRequestModel.PageSize);
                }

                List<TrashInspectionModel> trashInspections = await trashInspectionsQuery.Select(x => new TrashInspectionModel()
                {
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
                    Status = x.Status
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
                    Status = x.Status
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

        public async Task<OperationResult> CreateTrashInspection(TrashInspectionModel createModel)
        {
            TrashInspectionPnSetting trashInspectionSettings = await _dbContext.TrashInspectionPnSettings.SingleOrDefaultAsync(x => x.Name == "token");
            if (trashInspectionSettings == null)
            {
                return new OperationResult(false);
            }
            else
            {
                if (createModel.Token == trashInspectionSettings.Value)
                {
                    createModel.Status = 33;
                    createModel.Save(_dbContext);

//                    Installation installation =
//                        _dbContext.Installations.First(x => x.Name == createModel.InstallationName);
//
//                    if (installation != null)
//                    {
//                        Core core = _coreHelper.GetCore();
//                        var trashInspectionPnSetting = _dbContext.TrashInspectionPnSettings.FirstOrDefault();
//                        var selectedeFormId = trashInspectionPnSetting?.SelectedeFormId;
//                        if (selectedeFormId != null)
//                        {
//                            int eFormId = (int) selectedeFormId;
//                    
//                            Template_Dto eForm = core.TemplateItemRead(eFormId);
//                            foreach (InstallationSite installationSite in installation.InstallationSites)
//                            {
//                                var mainElement = core.TemplateRead(eFormId);
//                                mainElement.Repeated =
//                                    0; // We set this right now hardcoded, this will let the eForm be deployed until end date or we actively retract it.
//                                mainElement.EndDate = DateTime.Now.AddDays(2).ToUniversalTime();
//                                mainElement.StartDate = DateTime.Now.ToUniversalTime();
//                                string sdkCaseId = core.CaseCreate(mainElement, "", installationSite.SDKSiteId);
//                                TrashInspectionCase trashInspectionCase = new TrashInspectionCase();
//                                trashInspectionCase.Status = 66;
//                                trashInspectionCase.TrashInspectionId = createModel.Id;
//                                trashInspectionCase.SdkCaseId = sdkCaseId;
//
//                                _dbContext.TrashInspectionCases.Add(trashInspectionCase);
//                                await _dbContext.SaveChangesAsync();
//                            }
//                        }
//                    }
//                    createModel.Status = 66;
//                    createModel.Update(_dbContext);
                    return new OperationResult(true);
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

    }
}
