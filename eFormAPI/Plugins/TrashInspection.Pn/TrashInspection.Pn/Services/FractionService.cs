using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection.Metadata;
using System.Threading.Tasks;
using eFormCore;
using eFormData;
using eFormShared;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Extensions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using Newtonsoft.Json.Linq;
using OpenStack.NetCoreSwiftClient.Extensions;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Helpers;
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
                if (!pnRequestModel.NameFilter.IsNullOrEmpty() && pnRequestModel.NameFilter != "")
                {
                    fractionsQuery = fractionsQuery.Where(x =>
                        x.Name.Contains(pnRequestModel.NameFilter) ||
                        x.Description.Contains(pnRequestModel.NameFilter));
                }
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

                fractionsQuery
                    = fractionsQuery
                        .Where(x => x.WorkflowState != eFormShared.Constants.WorkflowStates.Removed)
                        .Skip(pnRequestModel.Offset)
                        .Take(pnRequestModel.PageSize);
                
                List<FractionModel> fractions = await fractionsQuery.Select(x => new FractionModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    eFormId = x.eFormId,
                    Description = x.Description,
                    LocationCode = x.LocationCode,
                    ItemNumber = x.ItemNumber
                }).ToListAsync();

                fractionsModel.Total = await _dbContext.Fractions.CountAsync(x => x.WorkflowState != eFormShared.Constants.WorkflowStates.Removed);
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
                        Description = x.Description,
                        LocationCode = x.LocationCode,
                        ItemNumber = x.ItemNumber
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

        public async Task<OperationResult> ImportFraction(FractionImportModel fractionsAsJson)
        {
            try
            {
                {
                    JToken rawJson = JRaw.Parse(fractionsAsJson.ImportList);
                    JToken rawHeadersJson = JRaw.Parse(fractionsAsJson.Headers);

                    JToken headers = rawHeadersJson;
                    IEnumerable<JToken> fractionObjects = rawJson.Skip(1);
                    
                    foreach (JToken fractionObj in fractionObjects)
                    {
                        bool numberExists = int.TryParse(headers[0]["headerValue"].ToString(), out int numberColumn);
                        bool fractionNameExists = int.TryParse(headers[1]["headerValue"].ToString(),
                            out int nameColumn);
                        if (numberExists || fractionNameExists)
                        {
                            Fraction existingFraction = FindFraction(numberExists, numberColumn, fractionNameExists,
                                nameColumn, headers, fractionObj);
                            if (existingFraction == null)
                            {
                                FractionModel fractionModel =
                                    FractionsHelper.ComposeValues(new FractionModel(), headers, fractionObj);

                                FractionModel newFraction = new FractionModel
                                {
                                    ItemNumber = fractionModel.ItemNumber,
                                    Name = fractionModel.Name,
                                    Description = fractionModel.Description,
                                    LocationCode = fractionModel.LocationCode,
                                    eFormId = fractionModel.eFormId

                                };
                               await newFraction.Save(_dbContext);
  
                            }
                            else
                            {
                                if (existingFraction.WorkflowState == Constants.WorkflowStates.Removed)
                                {
                                    FractionModel fraction = new FractionModel
                                    {
                                        Id = existingFraction.Id,
                                        Description = existingFraction.Description,
                                        Name = existingFraction.Name,
                                        LocationCode = existingFraction.LocationCode,
                                        eFormId = existingFraction.eFormId,

                                    };
                                    fraction.WorkflowState = Constants.WorkflowStates.Created;
                                    await fraction.Update(_dbContext);
                                }
                            }
                        }
                        
                    }
                }
                return new OperationResult(true,
                    _trashInspectionLocalizationService.GetString("FractionCreated"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _trashInspectionLocalizationService.GetString("ErrorWhileCreatingFraction"));
            }
        }
        
        public async Task<OperationResult> CreateFraction(FractionModel createModel)
        {
            await createModel.Save(_dbContext);
            
            return new OperationResult(true);

        }
        public async Task<OperationResult> UpdateFraction(FractionModel updateModel)
        {
            await updateModel.Update(_dbContext);
            
            return new OperationResult(true);

        }
        public async Task<OperationResult> DeleteFraction(int id)
        {
            FractionModel deleteModel = new FractionModel();
            deleteModel.Id = id;
            await deleteModel.Delete(_dbContext);
            return new OperationResult(true);
        }

        private Fraction FindFraction(bool numberExists, int numberColumn, bool fractionNameExists,
            int fractionNameColumn, JToken headers, JToken fractionObj)
        {
            Fraction fraction = null;

            if (numberExists)
            {
                string itemNo = fractionObj[numberColumn].ToString();
                fraction = _dbContext.Fractions.SingleOrDefault(x => x.ItemNumber == itemNo);
            }

            if (fractionNameExists)
            {
                string fractionName = fractionObj[fractionNameColumn].ToString();
                fraction = _dbContext.Fractions.SingleOrDefault(x => x.Name == fractionName);
            }

            return fraction;
        }
    }
}