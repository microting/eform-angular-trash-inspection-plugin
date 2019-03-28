using System.Collections.Generic;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class TrashInspectionsModel
    {
        public int Total { get; set; }
        public int NumOfElements { get; set; }
        public int PageNum { get; set; }
        public string Token { get; set; }
        public List<TrashInspectionModel> TrashInspectionList { get; set; }
    }
}
