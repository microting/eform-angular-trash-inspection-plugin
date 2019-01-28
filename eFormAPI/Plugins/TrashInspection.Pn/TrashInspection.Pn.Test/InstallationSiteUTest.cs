using System;
using System.Collections.Generic;
using System.Linq;
using TrashInspection.Pn.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
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
            installation.CreatedAt = DateTime.Now;
            installation.Name = Guid.NewGuid().ToString();


            DbContext.Installations.Add(installation);
            DbContext.SaveChanges();

            Random rnd = new Random();

            InstallationSiteModel installationSite = new InstallationSiteModel();
            installationSite.CreatedAt = DateTime.Now;
            installationSite.InstallationId = installation.Id;
            installationSite.SdkSiteId = rnd.Next(1, 255);

            // Act
            installationSite.Save(DbContext);

            InstallationSite dbInstallationSite = DbContext.InstallationSites.AsNoTracking().First();
            List<InstallationSite> installationSiteList = DbContext.InstallationSites.AsNoTracking().ToList();
            // Assert
            Assert.NotNull(dbInstallationSite);

            Assert.AreEqual(1, installationSiteList.Count());

            Assert.AreEqual(installationSite.CreatedAt.ToString(), dbInstallationSite.CreatedAt.ToString());
            Assert.AreEqual(installationSite.InstallationId, dbInstallationSite.InstallationId);


        }

        [Test]
        public void InstalationSiteModel_Update_DoesUpdate()
        {
            // Arrange
            Installation installation = new Installation();
            installation.CreatedAt = DateTime.Now;
            installation.Name = Guid.NewGuid().ToString();


            DbContext.Installations.Add(installation);
            DbContext.SaveChanges();

            Random rnd = new Random();
            InstallationSite installationSite = new InstallationSite();
            installationSite.CreatedAt = DateTime.Now;
            installationSite.InstallationId = installation.Id;
            installationSite.SDKSiteId = rnd.Next(1, 255);

            DbContext.InstallationSites.Add(installationSite);
            DbContext.SaveChanges();
            // Act
            InstallationSiteModel installationSiteModel = new InstallationSiteModel();
            installationSiteModel.CreatedAt = installation.CreatedAt;
            installationSiteModel.SdkSiteId = installationSite.SDKSiteId;
            installationSiteModel.InstallationId = installation.Id;
            installationSiteModel.Id = installationSite.Id;

            installationSiteModel.Update(DbContext);

            InstallationSite dbInstallationSite = DbContext.InstallationSites.AsNoTracking().First();
            List<InstallationSite> installationSiteList = DbContext.InstallationSites.AsNoTracking().ToList();
            // Assert
            Assert.NotNull(dbInstallationSite);

            Assert.AreEqual(1, installationSiteList.Count());

            Assert.AreEqual(installationSite.CreatedAt.ToString(), dbInstallationSite.CreatedAt.ToString());
            Assert.AreEqual(installationSite.SDKSiteId, dbInstallationSite.SDKSiteId);
            Assert.AreEqual(installationSite.InstallationId, dbInstallationSite.InstallationId);

        }

        [Test]
        public void InstallationSiteModel_Delete_DoesDelete()
        {
            // Arrange
            Installation installation = new Installation();
            installation.CreatedAt = DateTime.Now;
            installation.Name = Guid.NewGuid().ToString();


            DbContext.Installations.Add(installation);
            DbContext.SaveChanges();
            Random rnd = new Random();
            InstallationSite installationSite = new InstallationSite();
            installationSite.CreatedAt = DateTime.Now;
            installationSite.InstallationId = installation.Id;
            installationSite.SDKSiteId = rnd.Next(1, 255);

            DbContext.InstallationSites.Add(installationSite);
            DbContext.SaveChanges();
            // Act
            InstallationSiteModel installationSiteModel = new InstallationSiteModel();
            installationSiteModel.CreatedAt = installation.CreatedAt;
            installationSiteModel.SdkSiteId = installationSite.SDKSiteId;
            installationSiteModel.InstallationId = installation.Id;
            installationSiteModel.Id = installationSite.Id;
            installationSiteModel.Delete(DbContext);

            InstallationSite dbInstallationSite = DbContext.InstallationSites.AsNoTracking().First();
            List<InstallationSite> installationSiteList = DbContext.InstallationSites.AsNoTracking().ToList();
            // Assert
            Assert.NotNull(dbInstallationSite);

            Assert.AreEqual(1, installationSiteList.Count());

            Assert.AreEqual(installationSite.CreatedAt.ToString(), dbInstallationSite.CreatedAt.ToString());
            Assert.AreEqual(installationSite.SDKSiteId, dbInstallationSite.SDKSiteId);
            Assert.AreEqual(installationSite.InstallationId, dbInstallationSite.InstallationId);
            Assert.AreEqual(installationSite.WorkflowState, eFormShared.Constants.WorkflowStates.Removed);

        }

    }
}
