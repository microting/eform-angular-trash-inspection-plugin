using System.Collections.Generic;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class SegmentsModel
    {
        public int Total { get; set; }
        public List<SegmentModel> SegmentList { get; set; }

        public SegmentsModel()
        {
            SegmentList = new List<SegmentModel>();
        }
        
    }
}