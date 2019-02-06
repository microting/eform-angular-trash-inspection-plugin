using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using eFormShared;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class InstallationModel : IModel
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

        public void Save(TrashInspectionPnDbContext _dbContext)
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
        public void Update(TrashInspectionPnDbContext _dbContext)
        {
            Installation installation = _dbContext.Installations.FirstOrDefault(x => x.Id == Id);

            if( installation == null)
            {
                throw new NullReferenceException($"Could not find Installation with ID: {Id}");
            }
            installation.Name = Name;

            if (_dbContext.ChangeTracker.HasChanges())
            {
                installation.UpdatedAt = DateTime.Now;
                installation.UpdatedByUserId = UpdatedByUserId;
                installation.Version += 1;

                _dbContext.InstallationVersions.Add(MapInstallationVersion(_dbContext, installation));
                _dbContext.SaveChanges();
            }
        }
        public void Delete(TrashInspectionPnDbContext _dbContext)
        {
            Installation installation = _dbContext.Installations.FirstOrDefault(x => x.Id == Id);

            if (installation == null)
            {
                throw new NullReferenceException($"Could not find Installation with ID: {Id}");
            }
            installation.WorkflowState = eFormShared.Constants.WorkflowStates.Removed;

            if (_dbContext.ChangeTracker.HasChanges())
            {
                installation.UpdatedAt = DateTime.Now;
                installation.UpdatedByUserId = UpdatedByUserId;
                installation.Version += 1;
                //_dbContext.Installations.Remove(installation);
                _dbContext.InstallationVersions.Add(MapInstallationVersion(_dbContext, installation));
                _dbContext.SaveChanges();
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
