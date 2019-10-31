using System.Threading.Tasks;
using TrashInspection.Pn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace TrashInspection.Pn.Abstractions
{
    public interface ITrashInspectionPnSettingsService
    {
        Task<OperationDataResult<TrashInspectionBaseSettings>> GetSettings();
        Task<OperationResult> UpdateSettings(TrashInspectionBaseSettings trashInspectionSettingsModel);
        OperationDataResult<TrashInspectionBaseToken> GetToken();
    }
}
