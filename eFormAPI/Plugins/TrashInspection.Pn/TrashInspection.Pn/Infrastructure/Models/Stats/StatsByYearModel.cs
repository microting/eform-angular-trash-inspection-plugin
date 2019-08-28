using System.Collections.Generic;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class StatsByYearModel
    {
        public int Total { get; set; }
        
        public List<StatByYearModel> statsByYearList { get; set; }

        public StatsByYearModel()
        {
            statsByYearList = new List<StatByYearModel>();
        }
    }
}