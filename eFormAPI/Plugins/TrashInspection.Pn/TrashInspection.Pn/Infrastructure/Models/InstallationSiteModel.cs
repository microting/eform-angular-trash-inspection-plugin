using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using TrashInspection.Pn.Infrastructure.Data;
using TrashInspection.Pn.Infrastructure.Data.Entities;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class InstallationSiteModel : IModel
    {
        public int Id { get; set; }
        public DateTime? Created_at { get; set; }
        public DateTime? Updated_at { get; set; }
        [StringLength(255)]
        public string Workflow_state { get; set; }
        public int Version { get; set; }
        public int Created_By_User_Id { get; set; }
        public int Updated_By_User_Id { get; set; }
        public int Installation_Id { get; set; }
        public int SDK_Site_Id { get; set; }


        public void Save(TrashInspectionPnDbContext _dbContext)
        {
            InstallationSite installationSite = new InstallationSite();
            installationSite.Created_at = Created_at;
            installationSite.Created_By_User_Id = Created_By_User_Id;
            installationSite.Installation_Id = Installation_Id;
            installationSite.Sdk_Site_Id = SDK_Site_Id;
            installationSite.Updated_at = DateTime.Now;
            installationSite.Updated_By_User_Id = Updated_By_User_Id;
            installationSite.Version = Version;
            installationSite.Workflow_state = eFormShared.Constants.WorkflowStates.Created;

            _dbContext.InstallationSites.Add(installationSite);
            _dbContext.SaveChanges();

            _dbContext.InstallationSiteVersions.Add(MapInstallationSiteVersion(_dbContext, installationSite));
            _dbContext.SaveChanges();
        }
        public void Update(TrashInspectionPnDbContext _dbContext)
        {
            InstallationSite installationSite = _dbContext.InstallationSites.FirstOrDefault(x => x.Id == Id);

            if (installationSite == null)
            {
                throw new NullReferenceException($"Could not find InstallationSite with ID: {Id}");
            }
            installationSite.Installation_Id = Installation_Id;
            installationSite.Sdk_Site_Id = SDK_Site_Id;

            if (_dbContext.ChangeTracker.HasChanges())
            {
                installationSite.Updated_at = DateTime.Now;
                installationSite.Updated_By_User_Id = Updated_By_User_Id;
                installationSite.Version += 1;

                _dbContext.InstallationSiteVersions.Add(MapInstallationSiteVersion(_dbContext, installationSite));
                _dbContext.SaveChanges();
            }
        }
        public void Delete(TrashInspectionPnDbContext _dbContext)
        {
            InstallationSite installationSite = _dbContext.InstallationSites.FirstOrDefault(x => x.Id == Id);

            if (installationSite == null)
            {
                throw new NullReferenceException($"Could not find InstallationSite with ID: {Id}");
            }
            installationSite.Workflow_state = eFormShared.Constants.WorkflowStates.Removed;

            if (_dbContext.ChangeTracker.HasChanges())
            {
                installationSite.Updated_at = DateTime.Now;
                installationSite.Updated_By_User_Id = Updated_By_User_Id;
                installationSite.Version += 1;
                //_dbContext.InstallationSites.Remove(installationSite);
                _dbContext.InstallationSiteVersions.Add(MapInstallationSiteVersion(_dbContext, installationSite));
                _dbContext.SaveChanges();
            }
        }
        private InstallationSiteVersion MapInstallationSiteVersion(TrashInspectionPnDbContext _dbContext, InstallationSite installationSite)
        {
            InstallationSiteVersion installationSiteVer = new InstallationSiteVersion();

            installationSiteVer.Created_at = installationSite.Created_at;
            installationSiteVer.Created_By_User_Id = installationSite.Created_By_User_Id;
            installationSiteVer.Installation_Id = installationSite.Installation_Id;
            installationSiteVer.Sdk_Site_Id = installationSite.Sdk_Site_Id;
            installationSiteVer.Updated_at = installationSite.Updated_at;
            installationSiteVer.Updated_By_User_Id = installationSite.Updated_By_User_Id;
            installationSiteVer.Version = installationSite.Version;
            installationSiteVer.Workflow_state = installationSite.Workflow_state;

            installationSiteVer.Installation_Site_Id = installationSite.Id;

            return installationSiteVer;
        }
    }
}
