using System;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class TrashInspectionCaseStatusModel
    {
        public int SdkSiteId { get; set; }
        public int Status { get; set; }
        public DateTime? CreatedLocally { get; set; }
        public DateTime? SentToMicroting { get; set; }
        public DateTime? ReadyAtMicroting { get; set; }
        public DateTime? ReceivedOnTablet { get; set; }
        public DateTime? Answered { get; set; }
    }
}