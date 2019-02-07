using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TrashInspection.Pn.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using NUnit.Framework;

namespace TrashInspection.Pn.Test
{
    [TestFixture]
    public class InstallationUTest : DbTestFixture
    {
        [Test]
        public async Task  InstallationModel_Save_DoesSave()
        {
            // Arrange
            Random rnd = new Random();
            InstallationModel installation = new InstallationModel();
            installation.CreatedAt = DateTime.Now;
            installation.Name = Guid.NewGuid().ToString();
            
            // Act
          await  installation.Save(DbContext);

            Installation dbInstallation = DbContext.Installations.AsNoTracking().First();
            List<Installation> installationList = DbContext.Installations.AsNoTracking().ToList();
            // Assert
            Assert.NotNull(dbInstallation);

            Assert.AreEqual(1, installationList.Count());

            Assert.AreEqual(installation.CreatedAt.ToString(), dbInstallation.CreatedAt.ToString());
            Assert.AreEqual(installation.Name, dbInstallation.Name);
           

        }
        
        [Test]
        public async Task  InstalationModel_Update_DoesUpdate()
        {
            // Arrange
            Installation installation = new Installation();
            installation.CreatedAt = DateTime.Now;
            installation.Name = Guid.NewGuid().ToString();
            

            DbContext.Installations.Add(installation);
            DbContext.SaveChanges();

            // Act
            InstallationModel installationModel = new InstallationModel();
            installationModel.CreatedAt = installation.CreatedAt;
            installationModel.Name = installation.Name;
            installationModel.Id = installation.Id;

           await installationModel.Update(DbContext);

            Installation dbInstallation = DbContext.Installations.AsNoTracking().First();
            List<Installation> installationList = DbContext.Installations.AsNoTracking().ToList();
            // Assert
            Assert.NotNull(dbInstallation);

            Assert.AreEqual(1, installationList.Count());

            Assert.AreEqual(installation.CreatedAt.ToString(), dbInstallation.CreatedAt.ToString());
            Assert.AreEqual(installation.Name, dbInstallation.Name);
            Assert.AreEqual(installation.Id, dbInstallation.Id);
           
        }
        
        [Test]
        public async Task  InstallationModel_Delete_DoesDelete()
        {
            // Arrange
            Installation installation = new Installation();
            installation.CreatedAt = DateTime.Now;
            installation.Name = Guid.NewGuid().ToString();


            DbContext.Installations.Add(installation);
            DbContext.SaveChanges();

            // Act
            InstallationModel installationModel = new InstallationModel();
            installationModel.CreatedAt = installation.CreatedAt;
            installationModel.Name = installation.Name;
            installationModel.Id = installation.Id;

            await installationModel.Delete(DbContext);

            Installation dbInstallation = DbContext.Installations.AsNoTracking().First();
            List<Installation> installationList = DbContext.Installations.AsNoTracking().ToList();
            // Assert
            Assert.NotNull(dbInstallation);

            Assert.AreEqual(1, installationList.Count());

            Assert.AreEqual(installation.CreatedAt.ToString(), dbInstallation.CreatedAt.ToString());
            Assert.AreEqual(installation.Name, dbInstallation.Name);
            Assert.AreEqual(installation.Id, dbInstallation.Id);
            Assert.AreEqual(installation.WorkflowState, eFormShared.Constants.WorkflowStates.Removed);

        }

    }
}
