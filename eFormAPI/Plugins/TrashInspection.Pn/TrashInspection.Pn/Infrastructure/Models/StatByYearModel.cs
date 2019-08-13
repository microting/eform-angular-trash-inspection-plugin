using System;
using System.ComponentModel.DataAnnotations;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class StatByYearModel
    {
        public string Name { get; set; }
        public decimal Weighings { get; set; }
        public decimal AmountOfWeighingsControlled { get; set; }
        public decimal ControlPercentage { get; set; }
        public decimal ApprovedPercentage { get; set; }
        public decimal ConditionalApprovedPercentage { get; set; }
        public decimal NotApprovedPercentage { get; set; }
    }
}