using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Controllers
{
    public class SegmentController: Controller
    {
        
        private readonly ISegmentService _segmentService;

        public SegmentController(ISegmentService segmentService)
        {
            _segmentService = segmentService;
        }
        
        [HttpGet]
        [Route("api/trash-inspection-pn/fractions")]
        public async Task<OperationDataResult<SegmentsModel>> GetAllFractions(SegmentRequestModel requestModel)
        {
            return await _segmentService.GetAllSegments(requestModel);
        }

        [HttpGet]
        [Route("api/trash-inspection-pn/fractions/{id}")]
        public async Task<OperationDataResult<SegmentModel>> GetSingleFraction(int id)
        {
            return await _segmentService.GetSingleSegment(id);
        }

        [HttpPost]
        [Route("api/trash-inspection-pn/fractions")]
        public async Task<OperationResult> CreateFraction([FromBody] SegmentModel createModel)
        {
            return await _segmentService.CreateSegment(createModel);
        }

        [HttpPut]
        [Route("api/trash-inspection-pn/fractions")]
        public async Task<OperationResult> UpdateFraction([FromBody] SegmentModel updateModel)
        {
            return await _segmentService.UpdateSegment(updateModel);
        }

        [HttpDelete]
        [Route("api/trash-inspection-pn/fractions/{id}")]
        public async Task<OperationResult> DeleteFraction(int id)
        {
            return await _segmentService.DeleteSegment(id);
        }
    }
}