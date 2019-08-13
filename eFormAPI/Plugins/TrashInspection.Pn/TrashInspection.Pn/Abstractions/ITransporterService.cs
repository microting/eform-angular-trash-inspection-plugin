using System;
using System.Threading.Tasks;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Abstractions
{
    public interface ITransporterService
    {
        Task<OperationResult> CreateTransporter(TransporterModel transporterModel);
        Task<OperationResult> UpdateTransporter(TransporterModel transporterModel);
        Task<OperationResult> DeleteTransporter(int Id);
        Task<OperationResult> ImportTransporter(TransporterImportModel transporterImportModel);
        Task<OperationDataResult<TransportersModel>> GetAllTransporters(TransporterRequestModel pnRequestModel);
        Task<OperationDataResult<TransporterModel>> GetSingleTransporter(int id);
        Task<OperationDataResult<StatsByYearModel>> GetTransportersStatsByYear(int year);
    }
}