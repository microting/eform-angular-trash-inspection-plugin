using System.Threading.Tasks;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Abstractions
{
    public interface ITransporterService
    {
        Task<OperationDataResult<TransportersModel>> Index(TransporterRequestModel pnRequestModel);
        Task<OperationResult> Create(TransporterModel transporterModel);
        Task<OperationDataResult<TransporterModel>> Read(int id);
        Task<OperationResult> Update(TransporterModel transporterModel);
        Task<OperationResult> Delete(int Id);
        Task<OperationResult> ImportTransporter(TransporterImportModel transporterImportModel);
        Task<OperationDataResult<StatsByYearModel>> GetTransportersStatsByYear(TransportersYearRequestModel pnRequestModel);
        Task<OperationDataResult<StatByMonth>> GetSingleTransporterByMonth(int transporterId, int year);
    }
}