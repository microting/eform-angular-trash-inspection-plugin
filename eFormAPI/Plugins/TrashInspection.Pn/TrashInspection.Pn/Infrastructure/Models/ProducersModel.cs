using System.Collections.Generic;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class ProducersModel
    {
        public int Total { get; set; }
        public List<ProducerModel> ProducerList { get; set; }

        public ProducersModel()
        {
            ProducerList = new List<ProducerModel>();
        }
    }
}