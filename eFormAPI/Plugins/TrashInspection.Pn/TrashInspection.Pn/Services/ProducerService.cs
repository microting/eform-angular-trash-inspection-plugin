using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using eFormShared;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Extensions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;
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
        private readonly ILogger<ProducerService> _logger;
        private readonly TrashInspectionPnDbContext _dbContext;
        private readonly ITrashInspectionLocalizationService _trashInspectionLocalizationService;

        public ProducerService(ILogger<ProducerService> logger,
            TrashInspectionPnDbContext dbContext,
            IEFormCoreService coreHelper,
            ITrashInspectionLocalizationService trashInspectionLocalizationService)
        {
            _logger = logger;
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
                _logger.LogError(e.Message);
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
                    Name = x.Name,
                    Description = x.Description,
                    ForeignId = x.ForeignId,
                    Address = x.Address,
                    City = x.City,
                    ZipCode = x.ZipCode,
                    Phone = x.Phone,
                    ContactPerson = x.ContactPerson
                }).FirstOrDefaultAsync(x => x.Id == id);


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
                _logger.LogError(e.Message);
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
                        if (producerNameExists)
                        {
                            Producer existingProducer = FindProducer(producerNameExists,
                                nameColumn, headers, fractionObj);
                            if (existingProducer == null)
                            {
                                ProducerModel producerModel =
                                    ProducersHelper.ComposeValues(new ProducerModel(), headers, fractionObj);

                                ProducerModel newProducer = new ProducerModel
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
                               await newProducer.Save(_dbContext);
  
                            }
                            else
                            {
                                if (existingProducer.WorkflowState == Constants.WorkflowStates.Removed)
                                {
                                    ProducerModel producer = new ProducerModel
                                    {
                                        Id = existingProducer.Id,
                                        Description = existingProducer.Description,
                                        Name = existingProducer.Name,
                                        ForeignId = existingProducer.ForeignId,
                                        Address = existingProducer.Address,
                                        City = existingProducer.City,
                                        ZipCode = existingProducer.ZipCode,
                                        Phone = existingProducer.Phone,
                                        ContactPerson = existingProducer.Phone

                                    };
                                    producer.WorkflowState = Constants.WorkflowStates.Created;
                                    await producer.Update(_dbContext);
                                }
                            }
                        }
                        
                    }
                }
                return new OperationResult(true,
                    _trashInspectionLocalizationService.GetString("ProducerCreated"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false,
                    _trashInspectionLocalizationService.GetString("ErrorWhileCreatingProducer"));
            }
        }
        public async Task<OperationResult> CreateProducer(ProducerModel producerModel)
        {
           await producerModel.Save(_dbContext);
           
           return new OperationResult(true);
        }

        public async Task<OperationResult> UpdateProducer(ProducerModel producerModel)
        {
            await producerModel.Update(_dbContext);
            
            return new OperationResult(true);
        }

        public async Task<OperationResult> DeleteProducer(int Id)
        {
            ProducerModel producerModel = new ProducerModel();
            producerModel.Id = Id;
            await producerModel.Delete(_dbContext);
            return new OperationResult(true);
        }

        private Producer FindProducer(bool producerNameExists, int producerNameColumn, JToken headers,
            JToken producerObj)
        {
            Producer producer = null;

            if (producerNameExists)
            {
                string producerName = producerObj[producerNameColumn].ToString();
                producer = _dbContext.Producers.SingleOrDefault(x => x.Name == producerName);
            }

            return producer;
        }
    }
}