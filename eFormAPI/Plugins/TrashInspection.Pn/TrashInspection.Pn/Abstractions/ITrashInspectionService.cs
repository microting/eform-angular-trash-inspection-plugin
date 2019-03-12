using System.Threading.Tasks;
using TrashInspection.Pn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
namespace TrashInspection.Pn.Abstractions
{
    public interface ITrashInspectionService
    {
        Task<OperationResult> CreateTrashInspection(TrashInspectionModel model);
        Task<OperationResult> DeleteTrashInspection(int trashInspectionId);
        Task<OperationResult> DeleteTrashInspection(string weighingNumber, string token);
        Task<OperationResult> UpdateTrashInspection(TrashInspectionModel updateModel);
        Task<OperationDataResult<TrashInspectionsModel>> GetAllTrashInspections(TrashInspectionRequestModel requestModel);
        Task<string> DownloadEFormPdf(string weighingNumber, string token);
        Task<OperationDataResult<TrashInspectionModel>> GetSingleTrashInspection(int trashInspectionId);
    }
}
