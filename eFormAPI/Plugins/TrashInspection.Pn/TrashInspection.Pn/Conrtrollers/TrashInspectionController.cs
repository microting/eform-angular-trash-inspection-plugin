using System.Threading.Tasks;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace TrashInspection.Pn.Conrtrollers
{
    [Authorize]
    public class TrashInspectionController : Controller
    {
        private readonly ITrashInspectionService _trashInspectionService;

        public TrashInspectionController(ITrashInspectionService trashInspectionService)
        {
            _trashInspectionService = trashInspectionService;
        }

        [HttpGet]
        [Route("api/trash-inspection-pn/inspections")]
        public async Task<OperationDataResult<TrashInspectionModel>> GetAllTrashInspections(TrashInspectionRequestModel requestModel)
        {
            return await _trashInspectionService.GetAllTrashInspections(requestModel);
        }

        [HttpGet]
        [Route("api/trash-inspection-pn/inspections/{id}")]
        public async Task<OperationDataResult<TrashInspectionModel>> GetSingleTrashInspection(int id)
        {
            return await _trashInspectionService.GetSingleTrashInspection(id);
        }

        [HttpPost]
        [Route("api/trash-inspection-pn/inspections")]
        public async Task<OperationResult> CreateTrashInspection([FromBody] TrashInspectionModel createModel)
        {
            return await _trashInspectionService.CreateTrashInspection(createModel);
        }

        [HttpPut]
        [Route("api/trash-inspection-pn/inspections")]
        public async Task<OperationResult> UpdateTrashInspection([FromBody] TrashInspectionModel updateModel)
        {
            return await _trashInspectionService.UpdatetrashInspection(updateModel);
        }

        [HttpDelete]
        [Route("api/trash-inspection-pn/inspections/{id}")]
        public async Task<OperationResult> DeleteTrashInspection(int trashInspectionId)
        {
            return await _trashInspectionService.DeleteTrashInspection(trashInspectionId);
        }
    }
}
