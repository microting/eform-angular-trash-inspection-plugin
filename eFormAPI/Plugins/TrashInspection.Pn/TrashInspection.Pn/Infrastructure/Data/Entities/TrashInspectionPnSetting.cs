﻿using Microting.eFormApi.BasePn.Infrastructure.Database.Base;


namespace TrashInspection.Pn.Infrastructure.Data.Entities
{
    public class TrashInspectionPnSetting: BaseEntity
    {
        public int? SelectedeFormId { get; set; }
        public string SelectedeFormName { get; set; }
        public string Token { get; set; }
    }
}
