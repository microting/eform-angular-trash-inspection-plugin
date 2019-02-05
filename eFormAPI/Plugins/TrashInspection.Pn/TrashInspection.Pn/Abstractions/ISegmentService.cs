using System.Threading.Tasks;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Abstractions
{
    public interface ISegmentService
    {
        Task<OperationResult> CreateSegment(SegmentModel model);
        Task<OperationResult> DeleteSegment(int id);
        Task<OperationResult> UpdateSegment(SegmentModel updateModel);
        Task<OperationDataResult<SegmentsModel>> GetAllSegments(SegmentRequestModel requestModel);
        Task<OperationDataResult<SegmentModel>> GetSingleSegment(int fractionId);
    }
}