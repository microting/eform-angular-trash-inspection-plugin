using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using eFormShared;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class InstallationModel : IDataAccessObject<TrashInspectionPnDbContext>
    {
        public int Id { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? Updated_at { get; set; }
        [StringLength(255)]
        public string Workflow_state { get; set; }
        public int Version { get; set; }
        public int CreatedByUserId { get; set; }
        public int UpdatedByUserId { get; set; }
        public string Name { get; set; }
        public List<SiteName_Dto> DeployedSites { get; set; }
        public List<DeployCheckbox> DeployCheckboxes { get; set; }

        public async Task Save(TrashInspectionPnDbContext _dbContext)
        {
            Installation installation = new Installation();
            installation.CreatedAt = DateTime.Now;                
            installation.CreatedByUserId = CreatedByUserId;
            installation.Name = Name;
            installation.UpdatedAt = DateTime.Now;
            installation.UpdatedByUserId = UpdatedByUserId;
            installation.Version = Version;
            installation.WorkflowState = Constants.WorkflowStates.Created;

            
            _dbContext.Installations.Add(installation);
            _dbContext.SaveChanges();
            
            _dbContext.InstallationVersions.Add(MapInstallationVersion(_dbContext, installation));
            _dbContext.SaveChanges();
            Id = installation.Id;
        }

        public void Create(TrashInspectionPnDbContext dbContext)
        {
            throw new NotImplementedException();
        }

        public void Update(TrashInspectionPnDbContext dbContext)
        {
            Installation installation = dbContext.Installations.FirstOrDefault(x => x.Id == Id);

            if( installation == null)
            {
                throw new NullReferenceException($"Could not find Installation with ID: {Id}");
            }
            installation.Name = Name;

            if (dbContext.ChangeTracker.HasChanges())
            {
                installation.UpdatedAt = DateTime.Now;
                installation.UpdatedByUserId = UpdatedByUserId;
                installation.Version += 1;

                dbContext.InstallationVersions.Add(MapInstallationVersion(dbContext, installation));
                dbContext.SaveChanges();            }

        }
        public void Delete(TrashInspectionPnDbContext dbContext)
        {
            Installation installation = dbContext.Installations.FirstOrDefault(x => x.Id == Id);

            if (installation == null)
            {
                throw new NullReferenceException($"Could not find Installation with ID: {Id}");
            }
            installation.WorkflowState = eFormShared.Constants.WorkflowStates.Removed;

            if (dbContext.ChangeTracker.HasChanges())
            {
                installation.UpdatedAt = DateTime.Now;
                installation.UpdatedByUserId = UpdatedByUserId;
                installation.Version += 1;
                //_dbContext.Installations.Remove(installation);
                dbContext.InstallationVersions.Add(MapInstallationVersion(dbContext, installation));
                dbContext.SaveChanges();
            }

        }

        private InstallationVersion MapInstallationVersion(TrashInspectionPnDbContext _dbContext, Installation installation)
        {
            InstallationVersion installationVer = new InstallationVersion();

            installationVer.CreatedAt = installation.CreatedAt;
            installationVer.CreatedByUserId = installation.CreatedByUserId;
            installationVer.Name = installation.Name;
            installationVer.UpdatedAt = installation.UpdatedAt;
            installationVer.UpdatedByUserId = installation.UpdatedByUserId;
            installationVer.Version = installation.Version;
            installationVer.WorkflowState = installation.WorkflowState;

            installationVer.InstallationId = installation.Id;

            return installationVer;
        }
    }
}
