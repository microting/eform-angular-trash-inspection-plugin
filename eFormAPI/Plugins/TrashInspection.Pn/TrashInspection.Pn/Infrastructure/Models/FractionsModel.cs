using System.Collections.Generic;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class FractionsModel
    {
        public int Total { get; set; }
        public List<FractionModel> FractionList { get; set; }

        public FractionsModel()
        {
            FractionList = new List<FractionModel>();
        }
    }
}