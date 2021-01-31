using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Const;
using TrashInspection.Pn.Infrastructure.Models;

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
        public async Task<OperationDataResult<FractionsModel>> Index(FractionRequestModel requestModel)
        {
            return await _fractionService.Index(requestModel);
        }

        [HttpPost]
        [Route("api/trash-inspection-pn/fractions")]
        [Authorize(Policy = TrashInspectionClaims.CreateFractions)]
        public async Task<OperationResult> Create([FromBody] FractionModel createModel)
        {
            return await _fractionService.Create(createModel);
        }


        [HttpGet]
        [Route("api/trash-inspection-pn/fractions/{id}")]
        public async Task<OperationDataResult<FractionModel>> Read(int id)
        {
            return await _fractionService.Read(id);
        }

        [HttpPut]
        [Route("api/trash-inspection-pn/fractions")]
        public async Task<OperationResult> Update([FromBody] FractionModel updateModel)
        {
            return await _fractionService.Update(updateModel);
        }

        [HttpDelete]
        [Route("api/trash-inspection-pn/fractions/{id}")]
        public async Task<OperationResult> Delete(int id)
        {
            return await _fractionService.Delete(id);
        }

        [HttpPost]
        [Route("api/trash-inspection-pn/fractions/import")]
        public async Task<OperationResult> ImportFraction([FromBody] FractionImportModel fractionImportModel)
        {
            return await _fractionService.ImportFraction(fractionImportModel);
        }
        
        [HttpGet]
        [Route("api/trash-inspection-pn/fractions/year/{year}")]
        public async Task<OperationDataResult<StatsByYearModel>> GetFractionsStatsByYear(FractionPnYearRequestModel requestModel)
        {
            return await _fractionService.GetFractionsStatsByYear(requestModel);
        }
        
        [HttpGet]
        [Route("api/trash-inspection-pn/fractions/{id}/{year}")]
        public async Task<OperationDataResult<StatByMonth>> GetSingleFractionByMonth(int id, int year)
        {
            return await _fractionService.GetSingleFractionByMonth(id, year);
        }
    }
}
