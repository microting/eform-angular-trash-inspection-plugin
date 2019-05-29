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
using eFormCore;
using eFormShared;
using Microsoft.EntityFrameworkCore;
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
        private readonly TrashInspectionPnDbContext _dbContext;
        private readonly ITrashInspectionLocalizationService _trashInspectionLocalizationService;

        public FractionService(TrashInspectionPnDbContext dbContext,
            IEFormCoreService coreHelper,
            ITrashInspectionLocalizationService trashInspectionLocalizationService)
        {
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
                _coreHelper.LogException(e.Message);
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
                _coreHelper.LogException(e.Message);
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

                                Fraction newFraction = new Fraction
                                {
                                    ItemNumber = fractionModel.ItemNumber,
                                    Name = fractionModel.Name,
                                    Description = fractionModel.Description,
                                    LocationCode = fractionModel.LocationCode,
                                    eFormId = fractionModel.eFormId

                                };
                               newFraction.Create(_dbContext);
  
                            }
                            else
                            {
                                if (existingFraction.WorkflowState == Constants.WorkflowStates.Removed)
                                {                                    
                                    Fraction fraction = await _dbContext.Fractions.SingleOrDefaultAsync(x => x.Id == existingFraction.Id);
                                    if (fraction != null)
                                    {
                                        fraction.Name = existingFraction.Name;
                                        fraction.Description = existingFraction.Description;
                                        fraction.ItemNumber = existingFraction.ItemNumber;
                                        fraction.LocationCode = existingFraction.LocationCode;
                                        fraction.WorkflowState = Constants.WorkflowStates.Created;

                                        fraction.Update(_dbContext);
                                    }
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
                _coreHelper.LogException(e.Message);
                return new OperationResult(false,
                    _trashInspectionLocalizationService.GetString("ErrorWhileCreatingFraction"));
            }
        }
        
        public async Task<OperationResult> CreateFraction(FractionModel createModel)
        {
            Fraction fraction = new Fraction
            {
                Name = createModel.Name,
                Description = createModel.Description,
                ItemNumber = createModel.ItemNumber,
                LocationCode = createModel.LocationCode
            };
            fraction.Create(_dbContext);
            
            return new OperationResult(true);

        }
        public async Task<OperationResult> UpdateFraction(FractionModel updateModel)
        {
            Fraction fraction = await _dbContext.Fractions.SingleOrDefaultAsync(x => x.Id == updateModel.Id);
            if (fraction != null)
            {
                fraction.Name = updateModel.Name;
                fraction.Description = updateModel.Description;
                fraction.ItemNumber = updateModel.ItemNumber;
                fraction.LocationCode = updateModel.LocationCode;

                fraction.Update(_dbContext);
            }
            
            return new OperationResult(true);

        }
        public async Task<OperationResult> DeleteFraction(int id)
        {
            Fraction fraction = await _dbContext.Fractions.SingleOrDefaultAsync(x => x.Id == id);

            if (fraction != null)
            {
                fraction.Delete(_dbContext);
            }
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