using System.Threading.Tasks;
using TrashInspection.Pn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace TrashInspection.Pn.Abstractions
{
    public interface IFractionService
    {
        Task<OperationDataResult<FractionsModel>> Index(FractionRequestModel requestModel);
        Task<OperationResult> Create(FractionModel model);
        Task<OperationDataResult<FractionModel>> Read(int fractionId);
        Task<OperationResult> Update(FractionModel updateModel);
        Task<OperationResult> Delete(int id);
        Task<OperationResult> ImportFraction(FractionImportModel fractionImportModel);
        Task<OperationDataResult<StatsByYearModel>> GetFractionsStatsByYear(FractionPnYearRequestModel requestModel);
        Task<OperationDataResult<StatByMonth>> GetSingleFractionByMonth(int id, int year);
    }
}