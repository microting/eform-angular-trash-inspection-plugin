using System.Threading.Tasks;
using TrashInspection.Pn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace TrashInspection.Pn.Abstractions
{
    public interface IInstallationService
    {
        Task<OperationResult> CreateInstallation(InstallationModel model);
        Task<OperationResult> DeleteInstallation(int installationId);
        Task<OperationResult> UpdateInstallation(InstallationModel updateModel);
        Task<OperationDataResult<InstallationsModel>> GetAllInstallations(InstallationRequestModel requestModel);
        Task<OperationDataResult<InstallationModel>> GetSingleInstallation(int installationId);
    }
}
