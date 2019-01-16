using System;
using System.Collections.Generic;
using System.Linq;
using TrashInspection.Pn.Infrastructure.Data.Entities;
using TrashInspection.Pn.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace TrashInspection.Pn.Test
{
    [TestFixture]
    public class InstallationSiteUTest : DbTestFixture
    {
        [Test]
        public void InstallationSiteModel_Save_DoesSave()
        {
            // Arrange
            Installation installation = new Installation();
            installation.Created_at = DateTime.Now;
            installation.Name = Guid.NewGuid().ToString();


            DbContext.Installations.Add(installation);
            DbContext.SaveChanges();

            Random rnd = new Random();

            InstallationSiteModel installationSite = new InstallationSiteModel();
            installationSite.Created_at = DateTime.Now;
            installationSite.Installation_Id = installation.Id;
            installationSite.SDK_Site_Id = rnd.Next(1, 255);

            // Act
            installationSite.Save(DbContext);

            InstallationSite dbInstallationSite = DbContext.InstallationSites.AsNoTracking().First();
            List<InstallationSite> installationSiteList = DbContext.InstallationSites.AsNoTracking().ToList();
            // Assert
            Assert.NotNull(dbInstallationSite);

            Assert.AreEqual(1, installationSiteList.Count());

            Assert.AreEqual(installationSite.Created_at.ToString(), dbInstallationSite.Created_at.ToString());
            Assert.AreEqual(installationSite.Installation_Id, dbInstallationSite.Installation_Id);


        }

        [Test]
        public void InstalationSiteModel_Update_DoesUpdate()
        {
            // Arrange
            Installation installation = new Installation();
            installation.Created_at = DateTime.Now;
            installation.Name = Guid.NewGuid().ToString();


            DbContext.Installations.Add(installation);
            DbContext.SaveChanges();

            Random rnd = new Random();
            InstallationSite installationSite = new InstallationSite();
            installationSite.Created_at = DateTime.Now;
            installationSite.Installation_Id = installation.Id;
            installationSite.Sdk_Site_Id = rnd.Next(1, 255);

            DbContext.InstallationSites.Add(installationSite);
            DbContext.SaveChanges();
            // Act
            InstallationSiteModel installationSiteModel = new InstallationSiteModel();
            installationSiteModel.Created_at = installation.Created_at;
            installationSiteModel.SDK_Site_Id = installationSite.Sdk_Site_Id;
            installationSiteModel.Installation_Id = installation.Id;
            installationSiteModel.Id = installationSite.Id;

            installationSiteModel.Update(DbContext);

            InstallationSite dbInstallationSite = DbContext.InstallationSites.AsNoTracking().First();
            List<InstallationSite> installationSiteList = DbContext.InstallationSites.AsNoTracking().ToList();
            // Assert
            Assert.NotNull(dbInstallationSite);

            Assert.AreEqual(1, installationSiteList.Count());

            Assert.AreEqual(installationSite.Created_at.ToString(), dbInstallationSite.Created_at.ToString());
            Assert.AreEqual(installationSite.Sdk_Site_Id, dbInstallationSite.Sdk_Site_Id);
            Assert.AreEqual(installationSite.Installation_Id, dbInstallationSite.Installation_Id);

        }

        [Test]
        public void InstallationSiteModel_Delete_DoesDelete()
        {
            // Arrange
            Installation installation = new Installation();
            installation.Created_at = DateTime.Now;
            installation.Name = Guid.NewGuid().ToString();


            DbContext.Installations.Add(installation);
            DbContext.SaveChanges();
            Random rnd = new Random();
            InstallationSite installationSite = new InstallationSite();
            installationSite.Created_at = DateTime.Now;
            installationSite.Installation_Id = installation.Id;
            installationSite.Sdk_Site_Id = rnd.Next(1, 255);

            DbContext.InstallationSites.Add(installationSite);
            DbContext.SaveChanges();
            // Act
            InstallationSiteModel installationSiteModel = new InstallationSiteModel();
            installationSiteModel.Created_at = installation.Created_at;
            installationSiteModel.SDK_Site_Id = installationSite.Sdk_Site_Id;
            installationSiteModel.Installation_Id = installation.Id;
            installationSiteModel.Id = installationSite.Id;
            installationSiteModel.Delete(DbContext);

            InstallationSite dbInstallationSite = DbContext.InstallationSites.AsNoTracking().First();
            List<InstallationSite> installationSiteList = DbContext.InstallationSites.AsNoTracking().ToList();
            // Assert
            Assert.NotNull(dbInstallationSite);

            Assert.AreEqual(1, installationSiteList.Count());

            Assert.AreEqual(installationSite.Created_at.ToString(), dbInstallationSite.Created_at.ToString());
            Assert.AreEqual(installationSite.Sdk_Site_Id, dbInstallationSite.Sdk_Site_Id);
            Assert.AreEqual(installationSite.Installation_Id, dbInstallationSite.Installation_Id);
            Assert.AreEqual(installationSite.Workflow_state, eFormShared.Constants.WorkflowStates.Removed);

        }

    }
}
