using System.Collections.Generic;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class StatByMonth
    {
        
        public List<List<object>> StatByMonthListData1 = new List<List<object>>();
        public List<List<object>> StatByMonthListData2 = new List<List<object>>();
        public List<List<object>> StatByMonthListData3 = new List<List<object>>();

        public StatByMonth()
        {
            StatByMonthListData1 = new List<List<object>>();
            StatByMonthListData2 = new List<List<object>>();
            StatByMonthListData3 = new List<List<object>>();
        }
    }
}