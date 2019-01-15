using System.Threading.Tasks;
using TrashInspection.Pn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace TrashInspection.Pn.Abstractions
{
    public interface IInstallationService
    {
        Task<OperationResult> CreateInstallation(InstallationModel model);
        Task<OperationResult> DeleteInstallation(int trashInspectionId);
        Task<OperationResult> UpdaeIstallation(InstallationModel updateModel);
        Task<OperationDataResult<InstallationsModel>> GetAllTrashInspections(InstallationRequestModel requestModel);
        Task<OperationDataResult<InstallationModel>> GetSingleTrashInspection(int trashInspectionId);
    }
}
