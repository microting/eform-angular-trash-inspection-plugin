using System;
using System.ComponentModel.DataAnnotations;
using Microting.eFormApi.BasePn.Infrastructure.Database.Base;

namespace TrashInspection.Pn.Infrastructure.Data.Entities
{
    public class InstallationSite : BaseEntity
    {

        public DateTime? Created_at { get; set; }

        public DateTime? Updated_at { get; set; }

        [StringLength(255)]
        public string Workflow_state { get; set; }

        public int Version { get; set; }

        public int Created_By_User_Id { get; set; }

        public int Updated_By_User_Id { get; set; }

        public int Installation_Id { get; set; }

        public int Sdk_Site_Id { get; set; }
    }
}
