using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Data;
using TrashInspection.Pn.Infrastructure.Extensions;
using TrashInspection.Pn.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Extensions;

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

                IQueryable<Infrastructure.Data.Entities.TrashInspection> trashInspectionsQuery = _dbContext.TrashInspections.AsQueryable();
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
                Eak_Code = x.Eak_Code,
                Installation_Id = x.Installation_Id,
                Must_Be_Inspected = x.Must_Be_Inspected,
                Producer = x.Producer,
                Registration_Number = x.Registration_Number,
                Time = x.Time,
                Transporter = x.Transporter,
                Trash_Fraction = x.Trash_Fraction,
                Weighing_Number = x.Weighing_Number
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
                    Eak_Code = x.Eak_Code,
                    Installation_Id = x.Installation_Id,
                    Must_Be_Inspected = x.Must_Be_Inspected,
                    Producer = x.Producer,
                    Registration_Number = x.Registration_Number,
                    Time = x.Time,
                    Transporter = x.Transporter,
                    Trash_Fraction = x.Trash_Fraction,
                    Weighing_Number = x.Weighing_Number
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
            createModel.Save(_dbContext);
            return new OperationResult(true);
                
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
