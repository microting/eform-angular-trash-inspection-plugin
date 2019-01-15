using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Data;
using TrashInspection.Pn.Infrastructure.Data.Entities;
using TrashInspection.Pn.Infrastructure.Extensions;
using TrashInspection.Pn.Infrastructure.Models;
using eFormCore;
using eFormData;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

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

        public async Task<OperationDataResult<TrashInspectionModel>> GetAllTrashInspections(TrashInspectionRequestModel pnRequestModel)
        {
            return new OperationDataResult<TrashInspectionModel>(true);
        }

        public async Task<OperationDataResult<TrashInspectionModel>> GetSingleTrashInspection(int trashInspectionId)
        {
            return new OperationDataResult<TrashInspectionModel>(true);
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
