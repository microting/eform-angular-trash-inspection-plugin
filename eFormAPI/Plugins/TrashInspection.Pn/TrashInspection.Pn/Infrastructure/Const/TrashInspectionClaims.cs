namespace TrashInspection.Pn.Infrastructure.Const
{
    public static class TrashInspectionClaims
    {
        public const string AccessTrashInspectionPlugin = "trash_inspection_plugin_access";

        #region trashinspections

        public const string AccessTrashInspections = "trash_inspections_access";
        public const string CreateTrashInspections = "trash_inspections_create";
        public const string UpdateTrashInspections = "trash_inspections_update";
        public const string DeleteTrashInspections = "trash_inspections_delete";
        public const string GetPdf = "trash_inspections_get_pdf";
        public const string GetDocx = "trash_inspections_get_docx";
        public const string GetStats = "trash_inspections_get_stats";
        
        #endregion
                
        #region installations
        
        public const string AccessInstallations = "installations_access";
        public const string CreateInstallations = "installations_create";
        public const string UpdateInstallations = "installations_update";
        public const string DeleteInstallations = "installations_delete";
        #endregion
        
        #region fractions

        public const string AccessFractions = "fractions_access";
        public const string CreateFractions = "fractions_create";
        public const string UpdateFractions = "fractions_update";
        public const string DeleteFractions = "fractions_delete";

        #endregion
        
        #region segments
        
        public const string AccessSegments = "segments_access";
        public const string CreateSegments = "segments_create";
        public const string UpdateSegments = "segments_update";
        public const string DeleteSegments = "segments_delete";
        
        #endregion
        
        #region producers
        
        public const string AccessProducers = "producers_access";
        public const string CreateProducers = "producers_create";
        public const string UpdateProducers = "producers_update";
        public const string DeleteProducers = "producers_delete";
        
        #endregion
        
        #region transporters
        
        public const string AccessTransporters = "trasnporters_access";
        public const string CreateTransporters = "trasnporters_create";
        public const string UpdateTransporters = "trasnporters_update";
        public const string DeleteTransporters = "trasnporters_delete";
        
        #endregion
        
        #region reports
        
        public const string AccessReports = "reports_access";
        public const string CreateReports = "reports_create";
        public const string UpdateReports = "reports_update";
        public const string DeleteReports = "reports_delete";
        
        #endregion

    }
}