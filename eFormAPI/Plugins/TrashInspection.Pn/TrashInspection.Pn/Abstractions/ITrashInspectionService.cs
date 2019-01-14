using System.Threading.Tasks;
using TrashInspection.Pn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
namespace TrashInspection.Pn.Abstractions
{
    public interface ITrashInspectionService
    {
        Task<OperationResult> CreateTrashInspection(TrashInspectionModel model);
        Task<OperationResult> DeleteTrashInspection(int trashInspectionId);
        Task<OperationResult> UpdateTrashInspection(TrashInspectionModel updateModel);
        Task<OperationDataResult<TrashInspectionModel>> GetAllTrashInspections(TrashInspectionRequestModel requestModel);
        Task<OperationDataResult<TrashInspectionModel>> GetSingleTrashInspection(int trashInspectionId);

    }
}
