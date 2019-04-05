using System.Collections.Generic;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class TransportersModel
    {
        public int Total { get; set; }
        public List<TransporterModel> TransporterList { get; set; }

        public TransportersModel()
        {
            TransporterList = new List<TransporterModel>();
        }
    }
}