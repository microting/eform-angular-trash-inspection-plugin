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
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure.Constants;
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

        public async Task<OperationDataResult<FractionsModel>> Index(FractionRequestModel pnRequestModel)
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
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
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

                fractionsModel.Total = await _dbContext.Fractions.CountAsync(x => x.WorkflowState != Constants.WorkflowStates.Removed);
                fractionsModel.FractionList = fractions;
                Core _core = await _coreHelper.GetCore();
                List<KeyValuePair<int, string>> eFormNames = new List<KeyValuePair<int, string>>();

                foreach (FractionModel fractionModel in fractions)
                {
                    if (fractionModel.eFormId > 0)
                    {
                        if (eFormNames.Any(x => x.Key == fractionModel.eFormId))
                        {
                            fractionModel.SelectedTemplateName = eFormNames.First(x => x.Key == fractionModel.eFormId).Value;
                        }
                        else
                        {
                            try
                            {
                                string eFormName = _core.TemplateItemRead(fractionModel.eFormId).Result.Label;
                                fractionModel.SelectedTemplateName = eFormName;
                                KeyValuePair<int, string> kvp =
                                    new KeyValuePair<int, string>(fractionModel.eFormId, eFormName);
                                eFormNames.Add(kvp);
                            }
                            catch
                            {
                                KeyValuePair<int, string> kvp = new KeyValuePair<int, string>(fractionModel.eFormId, "");
                                eFormNames.Add(kvp);
                            }
                        }
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
        public async Task<OperationResult> Create(FractionModel createModel)
        {
            Fraction fraction = new Fraction
            {
                Name = createModel.Name,
                Description = createModel.Description,
                ItemNumber = createModel.ItemNumber,
                LocationCode = createModel.LocationCode,
                eFormId = createModel.eFormId
            };
            await fraction.Create(_dbContext);
            
            return new OperationResult(true);

        }
        public async Task<OperationDataResult<FractionModel>> Read(int id)
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

                Core _core = await _coreHelper.GetCore();

                if (fraction.eFormId > 0)
                {
                    try {
                        string eFormName = _core.TemplateItemRead(fraction.eFormId).Result.Label;
                        fraction.SelectedTemplateName = eFormName;
                        
                    } catch {}
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
        
        public async Task<OperationResult> Update(FractionModel updateModel)
        {
            Fraction fraction = await _dbContext.Fractions.SingleOrDefaultAsync(x => x.Id == updateModel.Id);
            if (fraction != null)
            {
                fraction.Name = updateModel.Name;
                fraction.Description = updateModel.Description;
                fraction.ItemNumber = updateModel.ItemNumber;
                fraction.LocationCode = updateModel.LocationCode;
                fraction.eFormId = updateModel.eFormId;

                await fraction.Update(_dbContext);
            }
            
            return new OperationResult(true);

        }
        
        public async Task<OperationResult> Delete(int id)
        {
            Fraction fraction = await _dbContext.Fractions.SingleOrDefaultAsync(x => x.Id == id);

            if (fraction != null)
            {
                await fraction.Delete(_dbContext);
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
                                await newFraction.Create(_dbContext);
  
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

                                        await fraction.Update(_dbContext);
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
        public async Task<OperationDataResult<StatsByYearModel>> GetFractionsStatsByYear(FractionPnYearRequestModel pnRequestModel)
        {
            try
            {
                IQueryable<Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection> trashInspectionsQuery = _dbContext.TrashInspections.AsQueryable();

                trashInspectionsQuery.Where(x => x.Date.Year == pnRequestModel.Year);
                
                StatsByYearModel fractionsStatsByYearModel = new StatsByYearModel();

                IQueryable<Fraction> fractionQuery = _dbContext.Fractions.AsQueryable();

                if (!pnRequestModel.NameFilter.IsNullOrEmpty() && pnRequestModel.NameFilter != "")
                {
                    fractionQuery = fractionQuery.Where(x =>
                        x.Name.Contains(pnRequestModel.NameFilter) ||
                        x.Description.Contains(pnRequestModel.NameFilter));
                }

                if (pnRequestModel.Sort == "Name")
                {
                    
                    if (!string.IsNullOrEmpty(pnRequestModel.Sort))
                    {
                        if (pnRequestModel.IsSortDsc)
                        {
                            fractionQuery = fractionQuery
                                .CustomOrderByDescending(pnRequestModel.Sort);
                        }
                        else
                        {
                            fractionQuery = fractionQuery
                                .CustomOrderBy(pnRequestModel.Sort);
                        }
                    }
                    else
                    {
                        fractionQuery = _dbContext.Fractions
                            .OrderBy(x => x.Id);
                    }
                }
                
                fractionQuery
                    = fractionQuery
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed);
                List<StatByYearModel> fractionsStatsByYear = await fractionQuery.Select(x => new StatByYearModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Weighings = trashInspectionsQuery.Count(t => t.FractionId == x.Id),
                    ControlPercentage = 0,
                    AmountOfWeighingsControlled = trashInspectionsQuery.Count(t => t.FractionId == x.Id && t.Status == 100),
                    ApprovedPercentage = trashInspectionsQuery.Count(t => t.FractionId == x.Id && t.IsApproved && t.Status == 100),
                    NotApprovedPercentage = trashInspectionsQuery.Count(t => t.FractionId == x.Id && t.ApprovedValue == "3" && t.Status == 100),
                    ConditionalApprovedPercentage = trashInspectionsQuery.Count(t => t.FractionId == x.Id && t.ApprovedValue == "2" && t.Status == 100)

                }).ToListAsync();

                foreach (StatByYearModel statByYearModel in fractionsStatsByYear)
                {
                    
                    if (statByYearModel.AmountOfWeighingsControlled > 0 && statByYearModel.Weighings > 0)
                    {
                        statByYearModel.ControlPercentage = Math.Round((statByYearModel.AmountOfWeighingsControlled / statByYearModel.Weighings) * 100, 1);
                    }
                    else
                    {
                        statByYearModel.ControlPercentage = 0;
                    }
                    
                    if (statByYearModel.ApprovedPercentage > 0 && statByYearModel.AmountOfWeighingsControlled > 0)
                    {
                        statByYearModel.ApprovedPercentage =
                            Math.Round((statByYearModel.ApprovedPercentage / statByYearModel.AmountOfWeighingsControlled) * 100, 1);
                    }
                    else
                    {
                        statByYearModel.ApprovedPercentage = 0;
                    }

                    if (statByYearModel.ConditionalApprovedPercentage > 0 && statByYearModel.AmountOfWeighingsControlled > 0)
                    {
                        statByYearModel.ConditionalApprovedPercentage = 
                            Math.Round((statByYearModel.ConditionalApprovedPercentage / statByYearModel.AmountOfWeighingsControlled) * 100, 1);
                    }
                    else
                    {
                        statByYearModel.ConditionalApprovedPercentage = 0;
                    }

                    if (statByYearModel.NotApprovedPercentage > 0 && statByYearModel.AmountOfWeighingsControlled > 0)
                    {
                        statByYearModel.NotApprovedPercentage =
                            Math.Round((statByYearModel.NotApprovedPercentage / statByYearModel.AmountOfWeighingsControlled) * 100, 1);
                    }
                    else
                    {
                        statByYearModel.NotApprovedPercentage = 0;
                    }
                }
                
                if (pnRequestModel.Sort == "Weighings")
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        fractionsStatsByYear = 
                            fractionsStatsByYear.OrderByDescending(x => x.Weighings).ToList();
                    }
                    else
                    {
                        fractionsStatsByYear = fractionsStatsByYear.OrderBy(x => x.Weighings).ToList();
                        
                    }
                }
                if (pnRequestModel.Sort == "AmountOfWeighingsControlled")
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        fractionsStatsByYear = 
                            fractionsStatsByYear.OrderByDescending(x => x.AmountOfWeighingsControlled).ToList();
                    }
                    else
                    {
                        fractionsStatsByYear = fractionsStatsByYear.OrderBy(x => x.AmountOfWeighingsControlled).ToList();
                    }
                }

                if (pnRequestModel.Sort == "ControlPercentage")
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        fractionsStatsByYear =
                            fractionsStatsByYear.OrderByDescending(x => x.ControlPercentage).ToList();
                    }
                    else
                    {
                        fractionsStatsByYear = fractionsStatsByYear.OrderBy(x => x.ControlPercentage).ToList();
                    }
                }
                if (pnRequestModel.Sort == "ApprovedPercentage")
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        fractionsStatsByYear =
                            fractionsStatsByYear.OrderByDescending(x => x.ApprovedPercentage).ToList();
                    }
                    else
                    {
                        fractionsStatsByYear = fractionsStatsByYear.OrderBy(x => x.ApprovedPercentage).ToList();

                    }
                }
                if (pnRequestModel.Sort == "ConditionalApprovedPercentage")
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        fractionsStatsByYear =
                            fractionsStatsByYear.OrderByDescending(x => x.ConditionalApprovedPercentage).ToList();
                    }
                    else
                    {
                        fractionsStatsByYear = fractionsStatsByYear.OrderBy(x => x.ConditionalApprovedPercentage).ToList();

                    }
                }
                if (pnRequestModel.Sort == "NotApprovedPercentage")
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        fractionsStatsByYear =
                            fractionsStatsByYear.OrderByDescending(x => x.NotApprovedPercentage).ToList();
                    }
                    else
                    {
                        fractionsStatsByYear = fractionsStatsByYear.OrderBy(x => x.NotApprovedPercentage).ToList();
 
                    }
                }
                
                fractionsStatsByYearModel.Total =
                    _dbContext.Producers.Count(x => x.WorkflowState != Constants.WorkflowStates.Removed);
                fractionsStatsByYearModel.statsByYearList = fractionsStatsByYear;
                
                return new OperationDataResult<StatsByYearModel>(true, fractionsStatsByYearModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<StatsByYearModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingFractions"));
            }
        }

        public async Task<OperationDataResult<StatByMonth>> GetSingleFractionByMonth(int fractionId, int year)
        {
             try
             {
                 StatByMonth statByMonth = new StatByMonth();
                 statByMonth.StatByMonthListData1 = new List<Period>();
                 List<string> months = new List<string>()
                 {
                     "Jan","Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"
                 };
                 List<string> outcomes = new List<string>()
                 {
                     "Godkendt", "Betinget Godkendt", "Ikke Godkendt"
                 };
                 IQueryable<Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection> trashInspectionsQuery = 
                     _dbContext.TrashInspections.AsQueryable();
                 Period linePeriod = new Period()
                 {
                     Name = "Compliance"
                 };
                 linePeriod.Series = new List<SeriesObject>();
                 trashInspectionsQuery = trashInspectionsQuery.Where(x => x.Date.Year == year && x.FractionId == fractionId);
                 double wheigingsPrYear = await trashInspectionsQuery.CountAsync();
                 double wheigingsPrYearControlled = await trashInspectionsQuery.CountAsync(x => x.Status == 100);
                 double avgControlPercentagePrYear = (wheigingsPrYearControlled / wheigingsPrYear) * 100;
                 int i = 1;
                 int j = 0;
                 foreach (string month in months)
                 {
                     trashInspectionsQuery = trashInspectionsQuery.Where(x => x.Date.Month == i);
                     double wheigingsPrMonth = await trashInspectionsQuery.CountAsync();
                     double wheigingsPrMonthControlled = await trashInspectionsQuery.CountAsync(x => x.Status == 100);
                     double wheighingsApprovedPrMonth = await trashInspectionsQuery.CountAsync(x => x.IsApproved && x.Status == 100);
                     double wheighingsNotApprovedPrMonth = await trashInspectionsQuery.CountAsync(x => x.ApprovedValue == "3" && x.Status == 100);
                     double wheighingsPartiallyApprovedPrMonth = await trashInspectionsQuery.CountAsync(x => x.ApprovedValue == "2" && x.Status == 100);
                     double approvedWheighingsPercentage = 0;
                     double notApprovedWheighingPercentage = 0;
                     double partiallyApprovedWheighingPercentage = 0;
                     if (wheigingsPrMonthControlled != 0)
                     {
                         approvedWheighingsPercentage = Math.Round(
                             (wheighingsApprovedPrMonth / wheigingsPrMonthControlled) * 100, 1);
                         notApprovedWheighingPercentage =
                             Math.Round((wheighingsNotApprovedPrMonth / wheigingsPrMonthControlled) * 100, 1);
                         partiallyApprovedWheighingPercentage = 
                             Math.Round((wheighingsPartiallyApprovedPrMonth / wheigingsPrMonthControlled) * 100, 1);
                     }
                       
                     Period period = new Period()
                     {
                         Name = month
                     };
                     //Bar Chart Data
                     period.Series = new List<SeriesObject>();
                     SeriesObject seriesObject1 = new SeriesObject()
                     {
                         Name = outcomes[0],
                         Value = approvedWheighingsPercentage
                     };
                     period.Series.Add(seriesObject1);
                     SeriesObject seriesObject2 = new SeriesObject()
                     {
                         Name = outcomes[1],
                         Value = partiallyApprovedWheighingPercentage
                     };
                     period.Series.Add(seriesObject2);
                     SeriesObject seriesObject3 = new SeriesObject()
                     {
                         Name = outcomes[2],
                         Value = notApprovedWheighingPercentage
                     };
                     period.Series.Add(seriesObject3);
                     statByMonth.StatByMonthListData1.Add(period);
                    
                     //Line Chart Data
                     SeriesObject lineSeriesObject1 = new SeriesObject()
                     {
                         Name = months[j],
                         Value = approvedWheighingsPercentage
                     };
                     linePeriod.Series.Add(lineSeriesObject1);
                     i += 1;
                     j += 1;

                 }
                 statByMonth.StatByMonthListData2.Add(linePeriod);

//                   
                 return new OperationDataResult<StatByMonth>(true,
                     statByMonth);
             }
             catch (Exception e)
             {
                 Trace.TraceError(e.Message);
                 _coreHelper.LogException(e.Message);
                 return new OperationDataResult<StatByMonth>(false,
                     _trashInspectionLocalizationService.GetString("ErrorObtainingStatsByMonth"));
             }
        }

    }
}