using System.Threading.Tasks;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Abstractions
{
    public interface IProducerService
    {
        Task<OperationResult> CreateProducer(ProducerModel producerModel);
        Task<OperationResult> UpdateProducer(ProducerModel producerModel);
        Task<OperationResult> DeleteProducer(int Id);
        Task<OperationResult> ImportProducer(ProducerImportModel producersAsJson);
        Task<OperationDataResult<ProducersModel>> GetAllProducers(ProducerRequestModel pnRequestModel);
        Task<OperationDataResult<ProducerModel>> GetSingleProducer(int id);
        Task<OperationDataResult<StatsByYearModel>> GetProducersStatsByYear(ProducersYearRequestModel requestModel);
    }
}