using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microting.eFormApi.BasePn.Infrastructure.Database.Base;

namespace TrashInspection.Pn.Infrastructure.Data.Entities
{
    public class TrashInspection : BaseEntity
    {

        public DateTime? Created_at { get; set; }

        public DateTime? Updated_at { get; set; }

        [StringLength(255)]
        public string Workflow_state { get; set; }

        public int Version { get; set; }

        public int Created_By_User_Id { get; set; }

        public int Updated_By_User_Id { get; set; }

        public int Weighing_Number { get; set; }

        public DateTime Date { get; set; }

        public DateTime Time { get; set; }

        public string Registration_Number { get; set; }

        public int Trash_Fraction { get; set; }

        public int Eak_Code { get; set; }

        public string Producer { get; set; }

        public string Transporter { get; set; }
        [ForeignKey("Installation")]
        public int Installation_Id { get; set; }

        public bool Must_Be_Inspected { get; set; }
    }
}
