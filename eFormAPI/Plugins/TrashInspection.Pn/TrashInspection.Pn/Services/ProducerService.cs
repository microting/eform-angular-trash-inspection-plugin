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
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure.Constants;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
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
    public class ProducerService : IProducerService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly TrashInspectionPnDbContext _dbContext;
        private readonly ITrashInspectionLocalizationService _trashInspectionLocalizationService;

        public ProducerService(TrashInspectionPnDbContext dbContext,
            IEFormCoreService coreHelper,
            ITrashInspectionLocalizationService trashInspectionLocalizationService)
        {
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _trashInspectionLocalizationService = trashInspectionLocalizationService;
        }

        public async Task<OperationDataResult<ProducersModel>> GetAllProducers(ProducerRequestModel pnRequestModel)
        {
            try
            {
                ProducersModel producersModel = new ProducersModel();

                IQueryable<Producer> producersQuery = _dbContext.Producers.AsQueryable();

                if (!pnRequestModel.NameFilter.IsNullOrEmpty() && pnRequestModel.NameFilter != "")
                {
                    producersQuery = producersQuery.Where(x =>
                        x.Name.Contains(pnRequestModel.NameFilter) ||
                        x.Description.Contains(pnRequestModel.NameFilter));
                }
                if (!string.IsNullOrEmpty(pnRequestModel.Sort))
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        producersQuery = producersQuery
                            .CustomOrderByDescending(pnRequestModel.Sort);
                    }
                    else
                    {
                        producersQuery = producersQuery
                            .CustomOrderBy(pnRequestModel.Sort);
                    }
                }
                else
                {
                    producersQuery = _dbContext.Producers
                        .OrderBy(x => x.Id);
                }
                
                producersQuery
                    = producersQuery
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Skip(pnRequestModel.Offset)
                        .Take(pnRequestModel.PageSize);
                List<ProducerModel> producers = await producersQuery.Select(x => new ProducerModel()
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

                producersModel.Total =
                    _dbContext.Producers.Count(x => x.WorkflowState != Constants.WorkflowStates.Removed);
                producersModel.ProducerList = producers;
                
                return new OperationDataResult<ProducersModel>(true, producersModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<ProducersModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingProducers"));
            }
        }
        
        public async Task<OperationDataResult<ProducerModel>> GetSingleProducer(int id)
        {
            try
            {
                var producer = await _dbContext.Producers.Select(x => new ProducerModel()
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

                if (producer == null)
                {
                    return new OperationDataResult<ProducerModel>(false,
                        _trashInspectionLocalizationService.GetString($"ProducerWithID:{id}DoesNotExist"));
                }

                return new OperationDataResult<ProducerModel>(true, producer);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<ProducerModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingProducer"));
            }
        }
        public async Task<OperationResult> ImportProducer(ProducerImportModel producersAsJson)
        {
            try
            {
                {
                    JToken rawJson = JRaw.Parse(producersAsJson.ImportList);
                    JToken rawHeadersJson = JRaw.Parse(producersAsJson.Headers);

                    JToken headers = rawHeadersJson;
                    IEnumerable<JToken> fractionObjects = rawJson.Skip(1);
                    
                    foreach (JToken fractionObj in fractionObjects)
                    {
                        bool producerNameExists = int.TryParse(headers[0]["headerValue"].ToString(), out int nameColumn);
                        if (!producerNameExists) continue;
                        Producer existingProducer = FindProducer(nameColumn, headers, fractionObj);
                        if (existingProducer == null)
                        {
                            ProducerModel producerModel =
                                ProducersHelper.ComposeValues(new ProducerModel(), headers, fractionObj);

                            Producer newProducer = new Producer
                            {
                                    
                                Name = producerModel.Name,
                                Description = producerModel.Description,
                                ForeignId = producerModel.ForeignId,
                                Address = producerModel.Address,
                                City = producerModel.City,
                                ZipCode = producerModel.ZipCode,
                                Phone = producerModel.Phone,
                                ContactPerson = producerModel.ContactPerson
                                    
                            };
                            newProducer.Create(_dbContext);
  
                        }
                        else
                        {
                            ProducerModel producerModel =
                                ProducersHelper.ComposeValues(new ProducerModel(), headers, fractionObj);
                            existingProducer.Name = producerModel.Name;
                            existingProducer.Description = producerModel.Description;
                            existingProducer.ForeignId = producerModel.ForeignId;
                            existingProducer.Address = producerModel.Address;
                            existingProducer.City = producerModel.City;
                            existingProducer.ZipCode = producerModel.ZipCode;
                            existingProducer.Phone = producerModel.Phone;
                            existingProducer.ContactPerson = producerModel.ContactPerson;
                                
                            if (existingProducer.WorkflowState == Constants.WorkflowStates.Removed)
                            {
                                existingProducer.WorkflowState = Constants.WorkflowStates.Created;
                            }
                            
                            existingProducer.Update(_dbContext);
                        }

                    }
                }
                return new OperationResult(true,
                    _trashInspectionLocalizationService.GetString("ProducerCreated"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationResult(false,
                    _trashInspectionLocalizationService.GetString("ErrorWhileCreatingProducer"));
            }
        }
        public async Task<OperationResult> CreateProducer(ProducerModel producerModel)
        {
            Producer producer = new Producer
            {
                Name = producerModel.Name,
                Description = producerModel.Description,
                ForeignId = producerModel.ForeignId,
                Address = producerModel.Address,
                City = producerModel.City,
                ZipCode = producerModel.ZipCode,
                Phone = producerModel.Phone,
                ContactPerson = producerModel.ContactPerson
            };
           producer.Create(_dbContext);
           
           return new OperationResult(true);
        }

        public async Task<OperationResult> UpdateProducer(ProducerModel producerModel)
        {
            Producer producer = await _dbContext.Producers.SingleOrDefaultAsync(x => x.Id == producerModel.Id);
            if (producer != null)
            {
                producer.Name = producerModel.Name;
                producer.Description = producerModel.Description;
                producer.Address = producerModel.Address;
                producer.ForeignId = producerModel.ForeignId;
                producer.City = producerModel.City;
                producer.ZipCode = producerModel.ZipCode;
                producer.Phone = producerModel.Phone;
                producer.ContactPerson = producerModel.ContactPerson;
            }
            producer.Update(_dbContext);
            
            return new OperationResult(true);
        }

        public async Task<OperationResult> DeleteProducer(int id)
        {
            Producer producer = await _dbContext.Producers.SingleOrDefaultAsync(x => x.Id == id);
            producer.Delete(_dbContext);
            return new OperationResult(true);
        }

        private Producer FindProducer(int producerNameColumn, JToken headers, JToken producerObj)
        {
            string producerName = producerObj[producerNameColumn].ToString();
            Producer producer = _dbContext.Producers.SingleOrDefault(x => x.Name == producerName);

            return producer;
        }
        
        public async Task<OperationDataResult<StatsByYearModel>> GetProducersStatsByYear(int year)
        {
            try
            {
                IQueryable<Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection> trashInspectionsQuery = _dbContext.TrashInspections.AsQueryable();

                trashInspectionsQuery.Where(x => x.Date.Year == year);
                
                StatsByYearModel producersStatsByYearModel = new StatsByYearModel();

                // - get all trashinspection where Date.year == year
                // - get all producers
                // - foreach producers
                // 

                IQueryable<Producer> producerQuery = _dbContext.Producers.AsQueryable();

                producerQuery
                    = producerQuery
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed);
                List<StatByYearModel> producersStatByYear = await producerQuery.Select(x => new StatByYearModel()
                {
                    Name = x.Name,
                    Weighings = trashInspectionsQuery.Count(t => t.ProducerId == x.Id),
                    ControlPercentage = 0,
                    AmountOfWeighingsControlled = trashInspectionsQuery.Count(t => t.ProducerId == x.Id && t.Status == 100),
                    ApprovedPercentage = trashInspectionsQuery.Count(t => t.ProducerId == x.Id && t.IsApproved && t.Status == 100),
                    NotApprovedPercentage = trashInspectionsQuery.Count(t => t.ProducerId == x.Id && !t.IsApproved && t.Status == 100),
                    ConditionalApprovedPercentage = 0

                }).ToListAsync();

                foreach (StatByYearModel statByYearModel in producersStatByYear)
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
                
                producersStatsByYearModel.Total =
                    _dbContext.Producers.Count(x => x.WorkflowState != Constants.WorkflowStates.Removed);
                producersStatsByYearModel.statsByYearList = producersStatByYear;
                
                return new OperationDataResult<StatsByYearModel>(true, producersStatsByYearModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<StatsByYearModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingProducers"));
            }
        }
    }
}