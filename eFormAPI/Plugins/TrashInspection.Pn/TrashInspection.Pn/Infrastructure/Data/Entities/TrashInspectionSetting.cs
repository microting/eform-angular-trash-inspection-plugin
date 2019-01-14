using Microting.eFormApi.BasePn.Infrastructure.Database.Base;


namespace TrashInspection.Pn.Infrastructure.Data.Entities
{
    class TrashInspectionSetting: BaseEntity
    {
        public int? SelectedeFormId { get; set; }
        public string SelectedeFormName { get; set; }
    }
}
