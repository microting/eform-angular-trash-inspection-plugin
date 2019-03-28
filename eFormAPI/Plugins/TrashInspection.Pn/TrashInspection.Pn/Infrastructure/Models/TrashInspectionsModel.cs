using System.Collections.Generic;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class TrashInspectionsModel
    {
        public int Total { get; set; }
        public List<TrashInspectionModel> TrashInspectionList { get; set; }
    }
}
