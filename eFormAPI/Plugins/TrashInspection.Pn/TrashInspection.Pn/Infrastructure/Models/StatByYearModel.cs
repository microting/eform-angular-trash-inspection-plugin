using System;
using System.ComponentModel.DataAnnotations;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class StatByYearModel
    {
        public string Name { get; set; }
        public int Weighings { get; set; }
        public int AmountOfWeighingsControlled { get; set; }
        public double ControlPercentage { get; set; }
        public double ApprovedPercentage { get; set; }
        public double ConditionalApprovedPercentage { get; set; }
        public double NotApprovedPercentage { get; set; }
    }
}