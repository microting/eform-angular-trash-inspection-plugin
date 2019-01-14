using TrashInspection.Pn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace TrashInspection.Pn.Abstractions
{
    public interface ITrashInspectionPnSettingsService
    {
        OperationDataResult<TrashInspectionPnSettingsModel> GetSettings();
        OperationResult UpdateSettings(TrashInspectionPnSettingsModel trashInspectionSettingsModel);
    }
}
