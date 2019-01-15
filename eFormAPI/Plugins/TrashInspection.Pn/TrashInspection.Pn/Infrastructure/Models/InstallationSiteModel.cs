using System;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class InstallationSiteModel
    {
        public int Id { get; set; }
        public DateTime? Created_at { get; set; }
        public DateTime? Updated_at { get; set; }
        [StringLength(255)]
        public string Workflow_state { get; set; }
        public int Version { get; set; }
        public int Created_By_User_Id { get; set; }
        public int Updated_By_User_Id { get; set; }
        public int Installate_Id { get; set; }
        public int SDK_Case_Id { get; set; }
    }
}
