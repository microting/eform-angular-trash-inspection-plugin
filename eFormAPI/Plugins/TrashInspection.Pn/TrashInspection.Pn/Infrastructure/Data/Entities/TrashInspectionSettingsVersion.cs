using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microting.eFormApi.BasePn.Infrastructure.Database.Base;
namespace TrashInspection.Pn.Infrastructure.Data.Entities
{
    public class TrashInspectionSettingsVersion : BaseEntity
    {
        public int? SelectedeFormId { get; set; }
        public string SelectedeFormName { get; set; }

        [ForeignKey("TrashInspectionPnSetting")]
        public int Trash_Inspection_Id { get; set; }
    }
}
