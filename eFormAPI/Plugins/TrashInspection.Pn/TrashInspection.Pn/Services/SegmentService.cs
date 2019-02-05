using System.Threading.Tasks;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Services
{
    public class SegmentService : ISegmentService
    {
        public Task<OperationResult> CreateSegment(SegmentModel model)
        {
            throw new System.NotImplementedException();
        }

        public Task<OperationResult> DeleteSegment(int id)
        {
            throw new System.NotImplementedException();
        }

        public Task<OperationResult> UpdateSegment(SegmentModel updateModel)
        {
            throw new System.NotImplementedException();
        }

        public Task<OperationDataResult<SegmentsModel>> GetAllSegments(SegmentRequestModel requestModel)
        {
            throw new System.NotImplementedException();
        }

        public Task<OperationDataResult<SegmentModel>> GetSingleSegment(int fractionId)
        {
            throw new System.NotImplementedException();
        }
    }
}