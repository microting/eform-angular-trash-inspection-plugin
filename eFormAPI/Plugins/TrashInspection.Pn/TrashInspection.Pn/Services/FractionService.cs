using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using eFormCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Extensions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Services
{
    public class FractionService : IFractionService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILogger<InstallationService> _logger;
        private readonly TrashInspectionPnDbContext _dbContext;
        private readonly ITrashInspectionLocalizationService _trashInspectionLocalizationService;

        public FractionService(ILogger<InstallationService> logger,
            TrashInspectionPnDbContext dbContext,
            IEFormCoreService coreHelper,
            ITrashInspectionLocalizationService trashInspectionLocalizationService)
        {
            _logger = logger;
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _trashInspectionLocalizationService = trashInspectionLocalizationService;
        }

        public async Task<OperationDataResult<FractionsModel>> GetAllFractions(FractionRequestModel pnRequestModel)
        {
            try
            {
                FractionsModel fractionsModel = new FractionsModel();
                
                IQueryable<Fraction> fractionsQuery = _dbContext.Fractions.AsQueryable();
                if (!string.IsNullOrEmpty(pnRequestModel.Sort))
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        fractionsQuery = fractionsQuery
                            .CustomOrderByDescending(pnRequestModel.Sort);
                    }
                    else
                    {
                        fractionsQuery = fractionsQuery
                            .CustomOrderBy(pnRequestModel.Sort);
                    }
                }
                else
                {
                    fractionsQuery = _dbContext.Fractions
                        .OrderBy(x => x.Id);
                }

                if (pnRequestModel.PageSize != null)
                {
                    fractionsQuery = fractionsQuery
                        .Skip(pnRequestModel.Offset)
                        .Take((int)pnRequestModel.PageSize);
                }

                fractionsQuery = fractionsQuery.Where(x => x.WorkflowState != eFormShared.Constants.WorkflowStates.Removed);

                List<FractionModel> fractions = await fractionsQuery.Select(x => new FractionModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    eFormId = x.eFormId,
                    Description = x.Description
                }).ToListAsync();

                fractionsModel.Total = await _dbContext.Installations.CountAsync();
                fractionsModel.FractionList = fractions;
                Core _core = _coreHelper.GetCore();

                foreach (FractionModel fractionModel in fractions)
                {
                    if (fractionModel.eFormId > 0)
                    {
                        string eFormName = _core.TemplateItemRead(fractionModel.eFormId).Label;
                        fractionModel.SelectedTemplateName = eFormName;
                    }                    
                }
                
                return new OperationDataResult<FractionsModel>(true, fractionsModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<FractionsModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingFractions"));

            }
        }
        public async Task<OperationDataResult<FractionModel>> GetSingleFraction(int id)
        {
            try
            {
                var fraction = await _dbContext.Fractions.Select(x => new FractionModel()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        eFormId = x.eFormId,
                        Description = x.Description
                    })
                    .FirstOrDefaultAsync(x => x.Id == id);

                if (fraction == null)
                {                    
                    return new OperationDataResult<FractionModel>(false,
                        _trashInspectionLocalizationService.GetString($"FractionWithID:{id}DoesNotExist"));
                }

                Core _core = _coreHelper.GetCore();

                if (fraction.eFormId > 0)
                {
                    string eFormName = _core.TemplateItemRead(fraction.eFormId).Label;
                    fraction.SelectedTemplateName = eFormName;
                }
                return new OperationDataResult<FractionModel>(true, fraction);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<FractionModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingFraction"));
            }
        }

        public async Task<OperationResult> CreateFraction(FractionModel createModel)
        {
            createModel.Save(_dbContext);
            
            return new OperationResult(true);

        }
        public async Task<OperationResult> UpdateFraction(FractionModel updateModel)
        {
            updateModel.Update(_dbContext);
            
            return new OperationResult(true);

        }
        public async Task<OperationResult> DeleteFraction(int id)
        {
            FractionModel deleteModel = new FractionModel();
            deleteModel.Id = id;
            deleteModel.Delete(_dbContext);
            return new OperationResult(true);
        }

    }
}