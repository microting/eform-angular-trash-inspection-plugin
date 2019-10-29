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
using Castle.MicroKernel.ModelBuilder.Descriptors;
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
    public class TransporterService : ITransporterService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly TrashInspectionPnDbContext _dbContext;
        private readonly ITrashInspectionLocalizationService _trashInspectionLocalizationService;

        public TransporterService(TrashInspectionPnDbContext dbContext,
            IEFormCoreService coreHelper,
            ITrashInspectionLocalizationService trashInspectionLocalizationService)
        {
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _trashInspectionLocalizationService = trashInspectionLocalizationService;
        }

        public async Task<OperationDataResult<TransportersModel>> GetAllTransporters(TransporterRequestModel pnRequestModel)
        {
            try
            {
                TransportersModel transportersModel = new TransportersModel();

                IQueryable<Transporter> transporterQuery = _dbContext.Transporters.AsQueryable();

                if (!pnRequestModel.NameFilter.IsNullOrEmpty() && pnRequestModel.NameFilter != "")
                {
                    transporterQuery = transporterQuery.Where(x =>
                        x.Name.Contains(pnRequestModel.NameFilter) ||
                        x.Description.Contains(pnRequestModel.NameFilter));
                }
                if (!string.IsNullOrEmpty(pnRequestModel.Sort))
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        transporterQuery = transporterQuery
                            .CustomOrderByDescending(pnRequestModel.Sort);
                    }
                    else
                    {
                        transporterQuery = transporterQuery
                            .CustomOrderBy(pnRequestModel.Sort);
                    }
                }
                else
                {
                    transporterQuery = _dbContext.Transporters
                        .OrderBy(x => x.Id);
                }
                
                transporterQuery
                    = transporterQuery
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Skip(pnRequestModel.Offset)
                        .Take(pnRequestModel.PageSize);
                List<TransporterModel> transporters = await transporterQuery.Select(x => new TransporterModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    ForeignId = x.ForeignId,
                    Address = x.Address,
                    City = x.City,
                    ZipCode = x.ZipCode,
                    Phone = x.Phone,
                    ContactPerson = x.ContactPerson
                }).ToListAsync();

                transportersModel.Total =
                    _dbContext.Transporters.Count(x => x.WorkflowState != Constants.WorkflowStates.Removed);
                transportersModel.TransporterList = transporters;
                
                return new OperationDataResult<TransportersModel>(true, transportersModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<TransportersModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingTransporters"));
            }
        }
        
        public async Task<OperationDataResult<TransporterModel>> GetSingleTransporter(int id)
        {
            try
            {
                var transporter = await _dbContext.Transporters.Select(x => new TransporterModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    ForeignId = x.ForeignId,
                    Address = x.Address,
                    City = x.City,
                    ZipCode = x.ZipCode,
                    Phone = x.Phone,
                    ContactPerson = x.ContactPerson
                    
                }).FirstOrDefaultAsync(y => y.Id == id);

                if (transporter == null)
                {
                    return new OperationDataResult<TransporterModel>(false,
                        _trashInspectionLocalizationService.GetString($"TransporterWithID:{id}DoesNotExist"));
                }

                return new OperationDataResult<TransporterModel>(true, transporter);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<TransporterModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingTransporter"));
            }
        }
        public async Task<OperationResult> ImportTransporter(TransporterImportModel transporterAsJson)
        {
            try
            {
                {
                    JToken rawJson = JRaw.Parse(transporterAsJson.ImportList);
                    JToken rawHeadersJson = JRaw.Parse(transporterAsJson.Headers);

                    JToken headers = rawHeadersJson;
                    IEnumerable<JToken> fractionObjects = rawJson.Skip(1);
                    
                    foreach (JToken fractionObj in fractionObjects)
                    {
                        bool transporterNameExists = int.TryParse(headers[0]["headerValue"].ToString(), out int nameColumn);
                        if (transporterNameExists)
                        {
                            Transporter existingTransporter = FindTransporter(nameColumn, headers, fractionObj);
                            if (existingTransporter == null)
                            {
                                TransporterModel transporterModel =
                                    TransportersHelper.ComposeValues(new TransporterModel(), headers, fractionObj);

                                Transporter newTransporter = new Transporter
                                {
                                    
                                    Name = transporterModel.Name,
                                    Description = transporterModel.Description,
                                    ForeignId = transporterModel.ForeignId,
                                    Address = transporterModel.Address,
                                    City = transporterModel.City,
                                    ZipCode = transporterModel.ZipCode,
                                    Phone = transporterModel.Phone,
                                    ContactPerson = transporterModel.ContactPerson
                                    
                                };
                                await newTransporter.Create(_dbContext);
  
                            }
                            else
                            {
                                TransporterModel transporterModel =
                                    TransportersHelper.ComposeValues(new TransporterModel(), headers, fractionObj);

                                existingTransporter.Name = transporterModel.Name;
                                existingTransporter.Description = transporterModel.Description;
                                existingTransporter.ForeignId = transporterModel.ForeignId;
                                existingTransporter.Address = transporterModel.Address;
                                existingTransporter.City = transporterModel.City;
                                existingTransporter.ZipCode = transporterModel.ZipCode;
                                existingTransporter.Phone = transporterModel.Phone;
                                existingTransporter.ContactPerson = transporterModel.ContactPerson;
                                
                                if (existingTransporter.WorkflowState == Constants.WorkflowStates.Removed)
                                {
                                    existingTransporter.WorkflowState = Constants.WorkflowStates.Created;
                                }
                                
                                await existingTransporter.Update(_dbContext);
                            }
                        }
                        
                    }
                }
                return new OperationResult(true,
                    _trashInspectionLocalizationService.GetString("TransporterCreated"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationResult(false,
                    _trashInspectionLocalizationService.GetString("ErrorWhileCreatingTransporter"));
            }
        }
        public async Task<OperationResult> CreateTransporter(TransporterModel transporterModel)
        {
            Transporter transporter = new Transporter
            {
                Name = transporterModel.Name,
                Description = transporterModel.Description,
                ForeignId = transporterModel.ForeignId,
                City = transporterModel.City,
                Address = transporterModel.Address,
                Phone = transporterModel.Phone,
                ZipCode = transporterModel.ZipCode,
                ContactPerson = transporterModel.ContactPerson,
            };
           
            await transporter.Create(_dbContext);
           
           return new OperationResult(true);
        }

        public async Task<OperationResult> UpdateTransporter(TransporterModel transporterModel)
        {
            Transporter transporter = await _dbContext.Transporters.SingleOrDefaultAsync(x => x.Id == transporterModel.Id);
            
            if (transporter != null)
            {
                transporter.Name = transporterModel.Name;
                transporter.Description = transporterModel.Description;
                transporter.ForeignId = transporterModel.ForeignId;
                transporter.City = transporterModel.City;
                transporter.Address = transporterModel.Address;
                transporter.Phone = transporterModel.Phone;
                transporter.ZipCode = transporterModel.ZipCode;
                transporter.ContactPerson = transporterModel.ContactPerson;
                
                await transporter.Update(_dbContext);
                return new OperationResult(true);
            }
            return new OperationResult(false);        }

        public async Task<OperationResult> DeleteTransporter(int id)
        {
            Transporter transporter = await _dbContext.Transporters.SingleOrDefaultAsync(x => x.Id == id);
            if (transporter != null)
            {
                await transporter.Delete(_dbContext);
                return new OperationResult(true);
            }
            return new OperationResult(false);
        }

        private Transporter FindTransporter(int transporterNameColumn, JToken headers, JToken transporterObj)
        {
            string transporterName = transporterObj[transporterNameColumn].ToString();
            Transporter transporter = _dbContext.Transporters.SingleOrDefault(x => x.Name == transporterName);

            return transporter;
        }

        public async Task<OperationDataResult<StatsByYearModel>> GetTransportersStatsByYear(TransportersYearRequestModel pnRequestModel)
        {
            try
            {
                IQueryable<Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection> trashInspectionsQuery
                    = _dbContext.TrashInspections.AsQueryable();

                trashInspectionsQuery.Where(x => x.Date.Year == pnRequestModel.Year);
                
                StatsByYearModel transportersStatsByYearModel = new StatsByYearModel();

                IQueryable<Transporter> transporterQuery = _dbContext.Transporters.AsQueryable();

                if (!pnRequestModel.NameFilter.IsNullOrEmpty() && pnRequestModel.NameFilter != "")
                {
                    transporterQuery = transporterQuery.Where(x =>
                        x.Name.Contains(pnRequestModel.NameFilter) ||
                        x.Description.Contains(pnRequestModel.NameFilter));
                }

                if (pnRequestModel.Sort == "Name")
                {
                    
                    if (!string.IsNullOrEmpty(pnRequestModel.Sort))
                    {
                        if (pnRequestModel.IsSortDsc)
                        {
                            transporterQuery = transporterQuery
                                .CustomOrderByDescending(pnRequestModel.Sort);
                        }
                        else
                        {
                            transporterQuery = transporterQuery
                                .CustomOrderBy(pnRequestModel.Sort);
                        }
                    }
                    else
                    {
                        transporterQuery = _dbContext.Transporters
                            .OrderBy(x => x.Id);
                    }
                }

                transporterQuery
                    = transporterQuery
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed);
                List<StatByYearModel> transportersStatByYear = await transporterQuery.Select(x => new StatByYearModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Weighings = trashInspectionsQuery.Count(t => t.TransporterId == x.Id),
                    ControlPercentage = 0,
                    AmountOfWeighingsControlled = trashInspectionsQuery.Count(t => t.TransporterId == x.Id && t.Status == 100),
                    ApprovedPercentage = trashInspectionsQuery.Count(t => t.TransporterId == x.Id && t.IsApproved && t.Status == 100),
                    NotApprovedPercentage = trashInspectionsQuery.Count(t => t.TransporterId == x.Id && t.ApprovedValue == "3" && t.Status == 100),
                    ConditionalApprovedPercentage = trashInspectionsQuery.Count(t => t.TransporterId == x.Id && t.ApprovedValue == "2" && t.Status == 100)

                }).ToListAsync();

                foreach (StatByYearModel statByYearModel in transportersStatByYear)
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
                        transportersStatByYear = 
                            transportersStatByYear.OrderByDescending(x => x.Weighings).ToList();
                    }
                    else
                    {
                        transportersStatByYear = transportersStatByYear.OrderBy(x => x.Weighings).ToList();
                        
                    }
                }
                if (pnRequestModel.Sort == "AmountOfWeighingsControlled")
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        transportersStatByYear = 
                            transportersStatByYear.OrderByDescending(x => x.AmountOfWeighingsControlled).ToList();
                    }
                    else
                    {
                        transportersStatByYear = transportersStatByYear.OrderBy(x => x.AmountOfWeighingsControlled).ToList();
                    }
                }

                if (pnRequestModel.Sort == "ControlPercentage")
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        transportersStatByYear =
                            transportersStatByYear.OrderByDescending(x => x.ControlPercentage).ToList();
                    }
                    else
                    {
                        transportersStatByYear = transportersStatByYear.OrderBy(x => x.ControlPercentage).ToList();
                    }
                }
                if (pnRequestModel.Sort == "ApprovedPercentage")
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        transportersStatByYear =
                            transportersStatByYear.OrderByDescending(x => x.ApprovedPercentage).ToList();
                    }
                    else
                    {
                        transportersStatByYear = transportersStatByYear.OrderBy(x => x.ApprovedPercentage).ToList();

                    }
                }
                if (pnRequestModel.Sort == "ConditionalApprovedPercentage")
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        transportersStatByYear =
                            transportersStatByYear.OrderByDescending(x => x.ConditionalApprovedPercentage).ToList();
                    }
                    else
                    {
                        transportersStatByYear = transportersStatByYear.OrderBy(x => x.ConditionalApprovedPercentage).ToList();

                    }
                }
                if (pnRequestModel.Sort == "NotApprovedPercentage")
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        transportersStatByYear =
                            transportersStatByYear.OrderByDescending(x => x.NotApprovedPercentage).ToList();
                    }
                    else
                    {
                        transportersStatByYear = transportersStatByYear.OrderBy(x => x.NotApprovedPercentage).ToList();
 
                    }
                }
                
                transportersStatsByYearModel.Total =
                    _dbContext.Transporters.Count(x => x.WorkflowState != Constants.WorkflowStates.Removed);
                transportersStatsByYearModel.statsByYearList = transportersStatByYear;
                
                return new OperationDataResult<StatsByYearModel>(true, transportersStatsByYearModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<StatsByYearModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingTransporters"));
            }
        }
        
        public async Task<OperationDataResult<StatByMonth>> GetSingleTransporterByMonth(int transporterId, int year)
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
                trashInspectionsQuery = trashInspectionsQuery.Where(x => x.Date.Year == year && x.TransporterId == transporterId);
                double wheigingsPrYear = trashInspectionsQuery.Count();
                double wheigingsPrYearControlled = trashInspectionsQuery.Count(x => x.Status == 100);
                double avgControlPercentagePrYear = (wheigingsPrYearControlled / wheigingsPrYear) * 100;
                int i = 1;
                int j = 0;
                foreach (string month in months)
                {
                    trashInspectionsQuery = trashInspectionsQuery.Where(x => x.Date.Month == i);
                    double wheigingsPrMonth = trashInspectionsQuery.Count();
                    double wheigingsPrMonthControlled = trashInspectionsQuery.Count(x => x.Status == 100);
                    double wheighingsApprovedPrMonth = trashInspectionsQuery.Count(x => x.IsApproved && x.Status == 100);
                    double wheighingsNotApprovedPrMonth = trashInspectionsQuery.Count(x => x.ApprovedValue == "3" && x.Status == 100);
                    double wheighingsPartiallyApprovedPrMonth = trashInspectionsQuery.Count(x => x.ApprovedValue == "2" && x.Status == 100);
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