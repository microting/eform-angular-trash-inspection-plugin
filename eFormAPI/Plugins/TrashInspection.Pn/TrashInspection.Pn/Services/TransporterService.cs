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
                    _dbContext.Producers.Count(x => x.WorkflowState != Constants.WorkflowStates.Removed);
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
                var transporter = await _dbContext.Producers.Select(x => new TransporterModel()
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
                            Transporter existingTransporter = FindTransporter(transporterNameExists,
                                nameColumn, headers, fractionObj);
                            if (existingTransporter == null)
                            {
                                TransporterModel transporterModel =
                                    TransportersHelper.ComposeValues(new TransporterModel(), headers, fractionObj);

                                TransporterModel newTransporter = new TransporterModel
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
                               await newTransporter.Save(_dbContext);
  
                            }
                            else
                            {
                                if (existingTransporter.WorkflowState == Constants.WorkflowStates.Removed)
                                {
                                    TransporterModel transporter = new TransporterModel
                                    {
                                        Id = existingTransporter.Id,
                                        Description = existingTransporter.Description,
                                        Name = existingTransporter.Name,
                                        ForeignId = existingTransporter.ForeignId,
                                        Address = existingTransporter.Address,
                                        City = existingTransporter.City,
                                        ZipCode = existingTransporter.ZipCode,
                                        Phone = existingTransporter.Phone,
                                        ContactPerson = existingTransporter.Phone

                                    };
                                    transporter.WorkflowState = Constants.WorkflowStates.Created;
                                    await transporter.Update(_dbContext);
                                }
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
           await transporterModel.Save(_dbContext);
           
           return new OperationResult(true);
        }

        public async Task<OperationResult> UpdateTransporter(TransporterModel transporterModel)
        {
            await transporterModel.Update(_dbContext);
            
            return new OperationResult(true);
        }

        public async Task<OperationResult> DeleteTransporter(int Id)
        {
            TransporterModel transporterModel = new TransporterModel();
            transporterModel.Id = Id;
            await transporterModel.Delete(_dbContext);
            return new OperationResult(true);
        }

        private Transporter FindTransporter(bool transporterNameExists, int transporterNameColumn, JToken headers,
            JToken transporterObj)
        {
            Transporter transporter = null;

            if (transporterNameExists)
            {
                string transporterName = transporterObj[transporterNameColumn].ToString();
                transporter = _dbContext.Transporters.SingleOrDefault(x => x.Name == transporterName);
            }

            return transporter;
        }
    }
}