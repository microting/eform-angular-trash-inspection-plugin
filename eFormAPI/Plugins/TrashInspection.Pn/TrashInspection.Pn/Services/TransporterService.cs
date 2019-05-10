/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 microting

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
                               newTransporter.Create(_dbContext);
  
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
                                
                                existingTransporter.Update(_dbContext);
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
                City = transporterModel.City,
                Address = transporterModel.Address,
                Phone = transporterModel.Phone,
                ZipCode = transporterModel.ZipCode,
                ContactPerson = transporterModel.ContactPerson,
            };
           
            transporter.Create(_dbContext);
           
           return new OperationResult(true);
        }

        public async Task<OperationResult> UpdateTransporter(TransporterModel transporterModel)
        {
            Transporter transporter = await _dbContext.Transporters.SingleOrDefaultAsync(x => x.Id == transporterModel.Id);
            
            if (transporter != null)
            {
                transporter.Name = transporterModel.Name;
                transporter.Description = transporterModel.Description;
                transporter.City = transporterModel.City;
                transporter.Address = transporterModel.Address;
                transporter.Phone = transporterModel.Phone;
                transporter.ZipCode = transporterModel.ZipCode;
                transporter.ContactPerson = transporterModel.ContactPerson;
                
                transporter.Update(_dbContext);
                return new OperationResult(true);
            }
            return new OperationResult(false);        }

        public async Task<OperationResult> DeleteTransporter(int id)
        {
            Transporter transporter = await _dbContext.Transporters.SingleOrDefaultAsync(x => x.Id == id);
            if (transporter != null)
            {
                transporter.Delete(_dbContext);
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
    }
}