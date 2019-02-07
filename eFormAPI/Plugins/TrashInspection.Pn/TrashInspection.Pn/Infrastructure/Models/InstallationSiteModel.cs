using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class InstallationSiteModel : IModel
    {
        public int Id { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? Updated_at { get; set; }
        [StringLength(255)]
        public string Workflow_state { get; set; }
        public int Version { get; set; }
        public int CreatedByUserId { get; set; }
        public int UpdatedByUserId { get; set; }
        public int InstallationId { get; set; }
        public int SdkSiteId { get; set; }


        public async Task Save(TrashInspectionPnDbContext _dbContext)
        {
            InstallationSite installationSite = new InstallationSite();
            installationSite.CreatedAt = DateTime.Now;
            installationSite.CreatedByUserId = CreatedByUserId;
            installationSite.InstallationId = InstallationId;
            installationSite.SDKSiteId = SdkSiteId;
            installationSite.UpdatedAt = DateTime.Now;
            installationSite.UpdatedByUserId = UpdatedByUserId;
            installationSite.Version = Version;
            installationSite.WorkflowState = eFormShared.Constants.WorkflowStates.Created;

            _dbContext.InstallationSites.Add(installationSite);
            await  _dbContext.SaveChangesAsync();

            _dbContext.InstallationSiteVersions.Add(MapInstallationSiteVersion(_dbContext, installationSite));
            await _dbContext.SaveChangesAsync();
        }
        public async Task Update(TrashInspectionPnDbContext _dbContext)
        {
            InstallationSite installationSite = _dbContext.InstallationSites.FirstOrDefault(x => x.Id == Id);

            if (installationSite == null)
            {
                throw new NullReferenceException($"Could not find InstallationSite with ID: {Id}");
            }
            installationSite.InstallationId = InstallationId;
            installationSite.SDKSiteId = SdkSiteId;

            if (_dbContext.ChangeTracker.HasChanges())
            {
                installationSite.UpdatedAt = DateTime.Now;
                installationSite.UpdatedByUserId = UpdatedByUserId;
                installationSite.Version += 1;

                _dbContext.InstallationSiteVersions.Add(MapInstallationSiteVersion(_dbContext, installationSite));
                await  _dbContext.SaveChangesAsync();
            }

        }
        public async Task Delete(TrashInspectionPnDbContext _dbContext)
        {
            InstallationSite installationSite = _dbContext.InstallationSites.FirstOrDefault(x => x.Id == Id);

            if (installationSite == null)
            {
                throw new NullReferenceException($"Could not find InstallationSite with ID: {Id}");
            }
            installationSite.WorkflowState = eFormShared.Constants.WorkflowStates.Removed;

            if (_dbContext.ChangeTracker.HasChanges())
            {
                installationSite.UpdatedAt = DateTime.Now;
                installationSite.UpdatedByUserId = UpdatedByUserId;
                installationSite.Version += 1;
                //_dbContext.InstallationSites.Remove(installationSite);
                _dbContext.InstallationSiteVersions.Add(MapInstallationSiteVersion(_dbContext, installationSite));
                await  _dbContext.SaveChangesAsync();
            }

        }
        private InstallationSiteVersion MapInstallationSiteVersion(TrashInspectionPnDbContext _dbContext, InstallationSite installationSite)
        {
            InstallationSiteVersion installationSiteVer = new InstallationSiteVersion();

            installationSiteVer.CreatedAt = installationSite.CreatedAt;
            installationSiteVer.CreatedByUserId = installationSite.CreatedByUserId;
            installationSiteVer.InstallationId = installationSite.InstallationId;
            installationSiteVer.SDKSiteId = installationSite.SDKSiteId;
            installationSiteVer.UpdatedAt = installationSite.UpdatedAt;
            installationSiteVer.UpdatedByUserId = installationSite.UpdatedByUserId;
            installationSiteVer.Version = installationSite.Version;
            installationSiteVer.WorkflowState = installationSite.WorkflowState;

            installationSiteVer.InstallationSiteId = installationSite.Id;

            return installationSiteVer;
        }
    }
}
