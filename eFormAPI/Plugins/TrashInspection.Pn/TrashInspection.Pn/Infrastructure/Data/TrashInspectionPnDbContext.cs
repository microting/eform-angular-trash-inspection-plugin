using TrashInspection.Pn.Infrastructure.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace TrashInspection.Pn.Infrastructure.Data
{
    public class TrashInspectionPnDbContext : DbContext
    {

        public TrashInspectionPnDbContext() { }

        public TrashInspectionPnDbContext(DbContextOptions<TrashInspectionPnDbContext> options) : base(options)
        {

        }

        public DbSet<Installation> Installations { get; set; }
        public DbSet<InstallationVersion> InstallationVersions { get; set;}
        public DbSet<InstallationSite> InstallationSites { get; set; }
        public DbSet<InstallationSiteVersion> InstallationSiteVersions { get; set; }
        public DbSet<Entities.TrashInspection> TrashInspections { get; set; }
        public DbSet<TrashInspectionVersion> TrashInspectionVersions { get; set; }
        public DbSet<TrashInspectionPnSetting> TrashInspectionPnSettings { get; set; }
        public DbSet<TrashInspectionSettingsVersion> TrashInspectionSettingsVersions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

        }
    }
}
