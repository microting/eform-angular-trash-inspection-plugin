using System.Threading.Tasks;
using TrashInspection.Pn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace TrashInspection.Pn.Abstractions
{
    public interface IFractionService
    {
        Task<OperationResult> CreateFraction(FractionModel model);
        Task<OperationResult> DeleteFraction(int id);
        Task<OperationResult> UpdateFraction(FractionModel updateModel);
        Task<OperationResult> ImportFraction(FractionImportModel fractionImportModel);
        Task<OperationDataResult<FractionsModel>> GetAllFractions(FractionRequestModel requestModel);
        Task<OperationDataResult<FractionModel>> GetSingleFraction(int fractionId);
        Task<OperationDataResult<StatsByYearModel>> GetFractionsStatsByYear(FractionPnYearRequestModel requestModel);

    }
}