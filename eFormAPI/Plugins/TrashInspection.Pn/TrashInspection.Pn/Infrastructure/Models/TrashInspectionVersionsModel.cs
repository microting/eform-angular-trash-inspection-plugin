using System.Collections.Generic;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class TrashInspectionVersionsModel
    {
        public int Total { get; set; }
        
        public int NumOfElements { get; set; }
        
        public int PageNum { get; set; }
        
        public string Token { get; set; }
        
        public List<TrashInspectionVersion> TrashInspectionVersionList { get; set; }
        
        public List<TrashInspectionCaseStatusModel> TrashInspectionCaseStatusModels { get; set; } 
        
    }
}