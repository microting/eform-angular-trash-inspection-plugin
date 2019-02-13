using System.Threading.Tasks;
using TrashInspection.Pn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace TrashInspection.Pn.Abstractions
{
    public interface ITrashInspectionPnSettingsService
    {
        Task<OperationDataResult<TrashInspectionPnSettingsModel>> GetSettings();
        Task<OperationResult> UpdateSettings(TrashInspectionPnSettingsModel trashInspectionSettingsModel);
    }
}
