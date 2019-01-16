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
    public class InstallationUTest : DbTestFixture
    {
        [Test]
        public void InstallationModel_Save_DoesSave()
        {
            // Arrange
            Random rnd = new Random();
            InstallationModel installation = new InstallationModel();
            installation.Created_at = DateTime.Now;
            installation.Name = Guid.NewGuid().ToString();
            
            // Act
            installation.Save(DbContext);

            Installation dbInstallation = DbContext.Installations.AsNoTracking().First();
            List<Installation> installationList = DbContext.Installations.AsNoTracking().ToList();
            // Assert
            Assert.NotNull(dbInstallation);

            Assert.AreEqual(1, installationList.Count());

            Assert.AreEqual(installation.Created_at.ToString(), dbInstallation.Created_at.ToString());
            Assert.AreEqual(installation.Name, dbInstallation.Name);
           

        }
        
        [Test]
        public void InstalationModel_Update_DoesUpdate()
        {
            // Arrange
            Installation installation = new Installation();
            installation.Created_at = DateTime.Now;
            installation.Name = Guid.NewGuid().ToString();
            

            DbContext.Installations.Add(installation);
            DbContext.SaveChanges();

            // Act
            InstallationModel installationModel = new InstallationModel();
            installationModel.Created_at = installation.Created_at;
            installationModel.Name = installation.Name;
            installationModel.Id = installation.Id;

            installationModel.Update(DbContext);

            Installation dbInstallation = DbContext.Installations.AsNoTracking().First();
            List<Installation> installationList = DbContext.Installations.AsNoTracking().ToList();
            // Assert
            Assert.NotNull(dbInstallation);

            Assert.AreEqual(1, installationList.Count());

            Assert.AreEqual(installation.Created_at.ToString(), dbInstallation.Created_at.ToString());
            Assert.AreEqual(installation.Name, dbInstallation.Name);
            Assert.AreEqual(installation.Id, dbInstallation.Id);
           
        }
        
        [Test]
        public void InstallationModel_Delete_DoesDelete()
        {
            // Arrange
            Installation installation = new Installation();
            installation.Created_at = DateTime.Now;
            installation.Name = Guid.NewGuid().ToString();


            DbContext.Installations.Add(installation);
            DbContext.SaveChanges();

            // Act
            InstallationModel installationModel = new InstallationModel();
            installationModel.Created_at = installation.Created_at;
            installationModel.Name = installation.Name;
            installationModel.Id = installation.Id;

            installationModel.Delete(DbContext);

            Installation dbInstallation = DbContext.Installations.AsNoTracking().First();
            List<Installation> installationList = DbContext.Installations.AsNoTracking().ToList();
            // Assert
            Assert.NotNull(dbInstallation);

            Assert.AreEqual(1, installationList.Count());

            Assert.AreEqual(installation.Created_at.ToString(), dbInstallation.Created_at.ToString());
            Assert.AreEqual(installation.Name, dbInstallation.Name);
            Assert.AreEqual(installation.Id, dbInstallation.Id);
            Assert.AreEqual(installation.Workflow_state, eFormShared.Constants.WorkflowStates.Removed);

        }

    }
}
