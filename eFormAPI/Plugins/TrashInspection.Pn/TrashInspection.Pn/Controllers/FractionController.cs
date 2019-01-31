using System.Threading.Tasks;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace TrashInspection.Pn.Controllers
{
    [Authorize]
    public class FractionController : Controller
    {
        private readonly IFractionService _fractionService;

        public FractionController(IFractionService fractionService)
        {
            _fractionService = fractionService;
        }
        
        [HttpGet]
        [Route("api/trash-inspection-pn/fractions")]
        public async Task<OperationDataResult<FractionsModel>> GetAllFractions(FractionRequestModel requestModel)
        {
            return await _fractionService.GetAllFractions(requestModel);
        }

        [HttpGet]
        [Route("api/trash-inspection-pn/fractions/{id}")]
        public async Task<OperationDataResult<FractionModel>> GetSingleFraction(int id)
        {
            return await _fractionService.GetSingleFraction(id);
        }

        [HttpPost]
        [Route("api/trash-inspection-pn/fractions")]
        public async Task<OperationResult> CreateFraction([FromBody] FractionModel createModel)
        {
            return await _fractionService.CreateFraction(createModel);
        }

        [HttpPut]
        [Route("api/trash-inspection-pn/fractions")]
        public async Task<OperationResult> UpdateFraction([FromBody] FractionModel updateModel)
        {
            return await _fractionService.UpdateFraction(updateModel);
        }

        [HttpDelete]
        [Route("api/trash-inspection-pn/fractions/{id}")]
        public async Task<OperationResult> DeleteFraction(int id)
        {
            return await _fractionService.DeleteFraction(id);
        }
    }
}
