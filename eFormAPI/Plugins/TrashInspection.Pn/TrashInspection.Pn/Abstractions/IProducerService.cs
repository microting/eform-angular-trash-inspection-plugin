using System.Threading.Tasks;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Abstractions
{
    public interface IProducerService
    {
        Task<OperationDataResult<ProducersModel>> Index(ProducerRequestModel pnRequestModel);
        Task<OperationResult> Create(ProducerModel producerModel);
        Task<OperationDataResult<ProducerModel>> Read(int id);
        Task<OperationResult> Update(ProducerModel producerModel);
        Task<OperationResult> Delete(int Id);
        Task<OperationResult> ImportProducer(ProducerImportModel producersAsJson);
        Task<OperationDataResult<StatsByYearModel>> GetProducersStatsByYear(ProducersYearRequestModel requestModel);
        Task<OperationDataResult<StatByMonth>> GetSingleProducerByMonth(int id, int year);
    }
}