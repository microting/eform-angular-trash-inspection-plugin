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
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;
namespace TrashInspection.Pn.Services
{
    public class SegmentService : ISegmentService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly TrashInspectionPnDbContext _dbContext;
        private readonly ITrashInspectionLocalizationService _trashInspectionLocalizationService;
        
        public SegmentService(TrashInspectionPnDbContext dbContext,
            IEFormCoreService coreHelper,
            ITrashInspectionLocalizationService trashInspectionLocalizationService)
        {
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _trashInspectionLocalizationService = trashInspectionLocalizationService;
        }
        
        public async Task<OperationResult> CreateSegment(SegmentModel model)
        {
            
            model.Save(_dbContext);
            
            return new OperationResult(true);
        }

        public async Task<OperationResult> DeleteSegment(int id)
        {
            SegmentModel deleteModel = new SegmentModel();
            deleteModel.Id = id;
            await deleteModel.Delete(_dbContext);
            return new OperationResult(true);
        }

        public async Task<OperationResult> UpdateSegment(SegmentModel updateModel)
        {
            await updateModel.Update(_dbContext);
            
            return new OperationResult(true);
        }

        public async Task<OperationDataResult<SegmentsModel>> GetAllSegments(SegmentRequestModel pnRequestModel)
        {
            try
            {
                SegmentsModel segmentsModel = new SegmentsModel();
                
                IQueryable<Segment> segmentQuery = _dbContext.Segments.AsQueryable();
                if (!string.IsNullOrEmpty(pnRequestModel.Sort))
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        segmentQuery = segmentQuery
                            .CustomOrderByDescending(pnRequestModel.Sort);
                    }
                    else
                    {
                        segmentQuery = segmentQuery
                            .CustomOrderBy(pnRequestModel.Sort);
                    }
                }
                else
                {
                    segmentQuery = _dbContext.Segments
                        .OrderBy(x => x.Id);
                }

              
                 segmentQuery
                     = segmentQuery
                     .Where(x => x.WorkflowState != eFormShared.Constants.WorkflowStates.Removed)
                     .Skip(pnRequestModel.Offset)
                     .Take(pnRequestModel.PageSize);
                

                

                List<SegmentModel> segmentModels = await segmentQuery.Select(x => new SegmentModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    SdkFolderId = x.SdkFolderId
                }).ToListAsync();

                segmentsModel.Total = await _dbContext.Segments.CountAsync(x => x.WorkflowState != eFormShared.Constants.WorkflowStates.Removed);
                segmentsModel.SegmentList = segmentModels;
                Core _core = _coreHelper.GetCore();

                
                return new OperationDataResult<SegmentsModel>(true, segmentsModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<SegmentsModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingSegments"));

            }
        }

        public async Task<OperationDataResult<SegmentModel>> GetSingleSegment(int id)
        {
            try
            {
                var segment = await _dbContext.Segments.Select(x => new SegmentModel()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Description = x.Description,
                        SdkFolderId = x.SdkFolderId
                    })
                    .FirstOrDefaultAsync(x => x.Id == id);

                if (segment == null)
                {                    
                    return new OperationDataResult<SegmentModel>(false,
                        _trashInspectionLocalizationService.GetString($"SegmentWithID:{id}DoesNotExist"));
                }

                return new OperationDataResult<SegmentModel>(true, segment);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<SegmentModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingSegment"));
            }

        }
    }
}