using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Controllers
{
    public class ProducerController : Controller
    {

        private readonly IProducerService _producerService;

        public ProducerController(IProducerService producerService)
        {
            _producerService = producerService;
        }
        
        [HttpGet]
        [Route("api/trash-inspection-pn/producers")]
        public async Task<OperationDataResult<ProducersModel>> GetAllProducers(ProducerRequestModel requestModel)
        {
            return await _producerService.GetAllProducers(requestModel);
        }

        [HttpGet]
        [Route("api/trash-inspection-pn/producers/{id}")]
        public async Task<OperationDataResult<ProducerModel>> GetSingleProducer(int id)
        {
            return await _producerService.GetSingleProducer(id);
        }

        [HttpPost]
        [Route("api/trash-inspection-pn/producers")]
        public async Task<OperationResult> CreateProducer([FromBody] ProducerModel createModel)
        {
            return await _producerService.CreateProducer(createModel);
        }

        [HttpPut]
        [Route("api/trash-inspection-pn/producers")]
        public async Task<OperationResult> UpdateProducer([FromBody] ProducerModel updateModel)
        {
            return await _producerService.UpdateProducer(updateModel);
        }

        [HttpDelete]
        [Route("api/trash-inspection-pn/producers/{id}")]
        public async Task<OperationResult> DeleteProducer(int id)
        {
            return await _producerService.DeleteProducer(id);
        }

        [HttpPost]
        [Route("api/trash-inspection-pn/producers/import")]
        public async Task<OperationResult> ImportProducer([FromBody] ProducerImportModel producerImportModel)
        {
            return await _producerService.ImportProducer(producerImportModel);
        }
        
        [HttpGet]
        [Route("api/trash-inspection-pn/producers/year/{year}")]
        public async Task<OperationDataResult<StatsByYearModel>> GetProducersStatsByYear(ProducersYearRequestModel requestModel)
        {
            return await _producerService.GetProducersStatsByYear(requestModel);
        }
    }
}