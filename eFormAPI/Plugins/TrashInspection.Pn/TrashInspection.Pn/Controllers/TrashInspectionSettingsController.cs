using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

namespace TrashInspection.Pn.Controllers
{
    public class TrashInspectionSettingsController : Controller
    {
        private readonly ITrashInspectionPnSettingsService _trashInspectionPnSettingsService;

        public TrashInspectionSettingsController(ITrashInspectionPnSettingsService trashInspectionPnSettingsService)
        {
            _trashInspectionPnSettingsService = trashInspectionPnSettingsService;
        }

        [HttpGet]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/trash-inspection-pn/settings")]
        public OperationDataResult<TrashInspectionPnSettingsModel> GetSettings()
        {
            return _trashInspectionPnSettingsService.GetSettings();
        }

        [HttpPost]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/trash-inspection-pn/settings")]
        public OperationResult UpdateSettings([FromBody] TrashInspectionPnSettingsModel trashInspectionSettingsModel)
        {
            return _trashInspectionPnSettingsService.UpdateSettings(trashInspectionSettingsModel);
        }
    }
}
