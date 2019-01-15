using System.Threading.Tasks;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace TrashInspection.Pn.Controllers
{
    [Authorize]
    public class InstallationController : Controller
    {
        private readonly IInstallationService _installationService;

        public InstallationController(IInstallationService installationService)
        {
            _installationService = installationService;
        }

        [HttpGet]
        [Route("api/trash-inspection-pn/installations")]
        public async Task<OperationDataResult<InstallationsModel>> GetAllInstallations(InstallationRequestModel requestModel)
        {
            return await _installationService.GetAllInstallations(requestModel);
        }

        [HttpGet]
        [Route("api/trash-inspection-pn/installations/{id}")]
        public async Task<OperationDataResult<InstallationModel>> GetSingleInstallation(int installationId)
        {
            return await _installationService.GetSingleInstallation(installationId);
        }

        [HttpPost]
        [Route("api/trash-inspection-pn/installations")]
        public async Task<OperationResult> CreateInstallation([FromBody] InstallationModel createModel)
        {
            return await _installationService.CreateInstallation(createModel);
        }

        [HttpPut]
        [Route("api/trash-inspection-pn/installations")]
        public async Task<OperationResult> UpdateInstallation([FromBody] InstallationModel updateModel)
        {
            return await _installationService.UpdateInstallation(updateModel);
        }

        [HttpDelete]
        [Route("api/trash-inspection-pn/installations/{id}")]
        public async Task<OperationResult> DeleteInstallation(int installationId)
        {
            return await _installationService.DeleteInstallation(installationId);
        }
    }
}
