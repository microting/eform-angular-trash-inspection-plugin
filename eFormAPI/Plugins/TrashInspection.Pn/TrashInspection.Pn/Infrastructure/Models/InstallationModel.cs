using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using TrashInspection.Pn.Infrastructure.Data;
using TrashInspection.Pn.Infrastructure.Data.Entities;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class InstallationModel : IModel
    {
        public int Id { get; set; }
        public DateTime? Created_at { get; set; }
        public DateTime? Updated_at { get; set; }
        [StringLength(255)]
        public string Workflow_state { get; set; }
        public int Version { get; set; }
        public int Created_By_User_Id { get; set; }
        public int Updated_By_User_Id { get; set; }
        public string Name { get; set; }

        public void Save(TrashInspectionPnDbContext _dbContext)
        {
            Installation installation = new Installation();
            installation.Created_at = DateTime.Now;
            installation.Created_By_User_Id = Created_By_User_Id;
            installation.Name = Name;
            installation.Updated_at = DateTime.Now;
            installation.Updated_By_User_Id = Updated_By_User_Id;
            installation.Version = Version;
            installation.Workflow_state = eFormShared.Constants.WorkflowStates.Created;

            _dbContext.Installations.Add(installation);
            _dbContext.SaveChanges();

            _dbContext.InstallationVersions.Add(MapInstallationVersion(_dbContext, installation));
            _dbContext.SaveChanges();
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
                installation.Updated_at = DateTime.Now;
                installation.Updated_By_User_Id = Updated_By_User_Id;
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
            installation.Workflow_state = eFormShared.Constants.WorkflowStates.Removed;

            if (_dbContext.ChangeTracker.HasChanges())
            {
                installation.Updated_at = DateTime.Now;
                installation.Updated_By_User_Id = Updated_By_User_Id;
                installation.Version += 1;
                _dbContext.Installations.Remove(installation);
                _dbContext.InstallationVersions.Add(MapInstallationVersion(_dbContext, installation));
                _dbContext.SaveChanges();
            }
        }

        private InstallationVersion MapInstallationVersion(TrashInspectionPnDbContext _dbContext, Installation installation)
        {
            InstallationVersion installationVer = new InstallationVersion();

            installationVer.Created_at = installation.Created_at;
            installationVer.Created_By_User_Id = installation.Created_By_User_Id;
            installationVer.Name = installation.Name;
            installationVer.Updated_at = installation.Updated_at;
            installationVer.Updated_By_User_Id = installation.Updated_By_User_Id;
            installationVer.Version = installation.Version;
            installationVer.Workflow_state = installation.Workflow_state;

            installationVer.InstallationId = installation.Id;

            return installationVer;
        }
    }
}
