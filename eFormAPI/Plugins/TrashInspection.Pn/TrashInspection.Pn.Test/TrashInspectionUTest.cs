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
    public class TrashInspectionUTest : DbTestFixture
    {
        [Test]
        public void TrashInspectionModel_SaveWTrue_DoesSave()
        {
            // Arrange
            Random rnd = new Random();
            TrashInspectionModel trashInspectionModel = new TrashInspectionModel();
            trashInspectionModel.CreatedAt = DateTime.Now;
            trashInspectionModel.Date = DateTime.Now;
            trashInspectionModel.EakCode = rnd.Next(1, 255);
            trashInspectionModel.InstallationId = rnd.Next(1, 255);
            trashInspectionModel.MustBeInspected = true;
            trashInspectionModel.Producer = Guid.NewGuid().ToString();
            trashInspectionModel.RegistrationNumber = Guid.NewGuid().ToString();
            trashInspectionModel.Time = DateTime.Now;
            trashInspectionModel.Transporter = Guid.NewGuid().ToString();
            trashInspectionModel.TrashFraction = rnd.Next(1, 255);
            trashInspectionModel.WeighingNumber = rnd.Next(1, 255);
            // Act
            trashInspectionModel.Save(DbContext);

            Infrastructure.Data.Entities.TrashInspection trashInspection = DbContext.TrashInspections.AsNoTracking().First();
            List<Infrastructure.Data.Entities.TrashInspection> trashInspectionList = DbContext.TrashInspections.AsNoTracking().ToList();
            // Assert
            Assert.NotNull(trashInspection);

            Assert.AreEqual(1, trashInspectionList.Count());

            Assert.AreEqual(trashInspectionModel.CreatedAt.ToString(), trashInspection.Created_at.ToString());
            Assert.AreEqual(trashInspectionModel.CreatedByUserId, trashInspection.Created_By_User_Id);
            Assert.AreEqual(trashInspectionModel.Date.ToString(), trashInspection.Date.ToString());
            Assert.AreEqual(trashInspectionModel.EakCode, trashInspection.Eak_Code);
            Assert.AreEqual(trashInspectionModel.InstallationId, trashInspection.Installation_Id);
            Assert.AreEqual(trashInspectionModel.MustBeInspected, trashInspection.Must_Be_Inspected);
            Assert.AreEqual(trashInspectionModel.Producer, trashInspection.Producer);
            Assert.AreEqual(trashInspectionModel.RegistrationNumber, trashInspection.Registration_Number);
            Assert.AreEqual(trashInspectionModel.Time.ToString(), trashInspection.Time.ToString());
            Assert.AreEqual(trashInspectionModel.Transporter, trashInspection.Transporter);
            Assert.AreEqual(trashInspectionModel.TrashFraction, trashInspection.Trash_Fraction);
            Assert.AreEqual(trashInspectionModel.WeighingNumber, trashInspection.Weighing_Number);

        }
        [Test]
        public void TrashInspectionModel_SaveWFalse_DoesSave()
        {
            // Arrange
            Random rnd = new Random();
            TrashInspectionModel trashInspectionModel = new TrashInspectionModel();
            trashInspectionModel.CreatedAt = DateTime.Now;
            trashInspectionModel.Date = DateTime.Now;
            trashInspectionModel.EakCode = rnd.Next(1, 255);
            trashInspectionModel.InstallationId = rnd.Next(1, 255);
            trashInspectionModel.MustBeInspected = false;
            trashInspectionModel.Producer = Guid.NewGuid().ToString();
            trashInspectionModel.RegistrationNumber = Guid.NewGuid().ToString();
            trashInspectionModel.Time = DateTime.Now;
            trashInspectionModel.Transporter = Guid.NewGuid().ToString();
            trashInspectionModel.TrashFraction = rnd.Next(1, 255);
            trashInspectionModel.WeighingNumber = rnd.Next(1, 255);
            // Act
            trashInspectionModel.Save(DbContext);

            Infrastructure.Data.Entities.TrashInspection trashInspection = DbContext.TrashInspections.AsNoTracking().First();
            List<Infrastructure.Data.Entities.TrashInspection> trashInspectionList = DbContext.TrashInspections.AsNoTracking().ToList();
            // Assert
            Assert.NotNull(trashInspection);

            Assert.AreEqual(1, trashInspectionList.Count());

            Assert.AreEqual(trashInspectionModel.CreatedAt.ToString(), trashInspection.Created_at.ToString());
            Assert.AreEqual(trashInspectionModel.CreatedByUserId, trashInspection.Created_By_User_Id);
            Assert.AreEqual(trashInspectionModel.Date.ToString(), trashInspection.Date.ToString());
            Assert.AreEqual(trashInspectionModel.EakCode, trashInspection.Eak_Code);
            Assert.AreEqual(trashInspectionModel.InstallationId, trashInspection.Installation_Id);
            Assert.AreEqual(trashInspectionModel.MustBeInspected, trashInspection.Must_Be_Inspected);
            Assert.AreEqual(trashInspectionModel.Producer, trashInspection.Producer);
            Assert.AreEqual(trashInspectionModel.RegistrationNumber, trashInspection.Registration_Number);
            Assert.AreEqual(trashInspectionModel.Time.ToString(), trashInspection.Time.ToString());
            Assert.AreEqual(trashInspectionModel.Transporter, trashInspection.Transporter);
            Assert.AreEqual(trashInspectionModel.TrashFraction, trashInspection.Trash_Fraction);
            Assert.AreEqual(trashInspectionModel.WeighingNumber, trashInspection.Weighing_Number);

        }

        [Test]
        public void TrashInspectionModel_UpdateWTrue_DoesUpdate()
        {
            // Arrange
            Random rnd = new Random();

            Infrastructure.Data.Entities.TrashInspection trashInspection = new Infrastructure.Data.Entities.TrashInspection();
            trashInspection.Created_at = DateTime.Now;
            trashInspection.Date = DateTime.Now;
            trashInspection.Eak_Code = rnd.Next(1, 255);
            trashInspection.Installation_Id = rnd.Next(1, 255);
            trashInspection.Must_Be_Inspected = true;
            trashInspection.Producer = Guid.NewGuid().ToString();
            trashInspection.Registration_Number = Guid.NewGuid().ToString();
            trashInspection.Time = DateTime.Now;
            trashInspection.Transporter = Guid.NewGuid().ToString();
            trashInspection.Trash_Fraction = rnd.Next(1, 255);
            trashInspection.Weighing_Number = rnd.Next(1, 255);

            DbContext.TrashInspections.Add(trashInspection);
            DbContext.SaveChanges();

            // Act
            TrashInspectionModel trashInspectionModel = new TrashInspectionModel();
            trashInspectionModel.CreatedAt = trashInspection.Created_at;
            trashInspectionModel.Date = trashInspection.Date;
            trashInspectionModel.EakCode = trashInspection.Eak_Code;
            trashInspectionModel.Id = trashInspection.Id;
            trashInspectionModel.InstallationId = trashInspection.Installation_Id;
            trashInspectionModel.MustBeInspected = trashInspection.Must_Be_Inspected;
            trashInspectionModel.Producer = trashInspection.Producer;
            trashInspectionModel.RegistrationNumber = trashInspection.Registration_Number;
            trashInspectionModel.Time = trashInspection.Time;
            trashInspectionModel.Transporter = trashInspection.Transporter;
            trashInspectionModel.TrashFraction = trashInspection.Trash_Fraction;
            trashInspectionModel.WeighingNumber = trashInspection.Weighing_Number;

            trashInspectionModel.Update(DbContext);

            Infrastructure.Data.Entities.TrashInspection dbTrashInspection = DbContext.TrashInspections.AsNoTracking().First();
            List<Infrastructure.Data.Entities.TrashInspection> trashInspectionList = DbContext.TrashInspections.AsNoTracking().ToList();

            // Assert
            Assert.NotNull(dbTrashInspection);

            Assert.AreEqual(1, trashInspectionList.Count());

            Assert.AreEqual(trashInspection.Created_at.ToString(), dbTrashInspection.Created_at.ToString());
            Assert.AreEqual(trashInspection.Date.ToString(), dbTrashInspection.Date.ToString());
            Assert.AreEqual(trashInspection.Eak_Code, dbTrashInspection.Eak_Code);
            Assert.AreEqual(trashInspection.Installation_Id, dbTrashInspection.Installation_Id);
            Assert.AreEqual(trashInspection.Must_Be_Inspected, dbTrashInspection.Must_Be_Inspected);
            Assert.AreEqual(trashInspection.Producer, dbTrashInspection.Producer);
            Assert.AreEqual(trashInspection.Registration_Number, dbTrashInspection.Registration_Number);
            Assert.AreEqual(trashInspection.Time.ToString(), dbTrashInspection.Time.ToString());
            Assert.AreEqual(trashInspection.Transporter, dbTrashInspection.Transporter);
            Assert.AreEqual(trashInspection.Trash_Fraction, dbTrashInspection.Trash_Fraction);
            Assert.AreEqual(trashInspection.Weighing_Number, dbTrashInspection.Weighing_Number);
        }
        [Test]
        public void TrashInspectionModel_UpdateWFalse_DoesUpdate()
        {
            // Arrange
            Random rnd = new Random();

            Infrastructure.Data.Entities.TrashInspection trashInspection = new Infrastructure.Data.Entities.TrashInspection();
            trashInspection.Created_at = DateTime.Now;
            trashInspection.Date = DateTime.Now;
            trashInspection.Eak_Code = rnd.Next(1, 255);
            trashInspection.Installation_Id = rnd.Next(1, 255);
            trashInspection.Must_Be_Inspected = false;
            trashInspection.Producer = Guid.NewGuid().ToString();
            trashInspection.Registration_Number = Guid.NewGuid().ToString();
            trashInspection.Time = DateTime.Now;
            trashInspection.Transporter = Guid.NewGuid().ToString();
            trashInspection.Trash_Fraction = rnd.Next(1, 255);
            trashInspection.Weighing_Number = rnd.Next(1, 255);

            DbContext.TrashInspections.Add(trashInspection);
            DbContext.SaveChanges();

            // Act
            TrashInspectionModel trashInspectionModel = new TrashInspectionModel();
            trashInspectionModel.CreatedAt = trashInspection.Created_at;
            trashInspectionModel.Date = trashInspection.Date;
            trashInspectionModel.EakCode = trashInspection.Eak_Code;
            trashInspectionModel.Id = trashInspection.Id;
            trashInspectionModel.InstallationId = trashInspection.Installation_Id;
            trashInspectionModel.MustBeInspected = trashInspection.Must_Be_Inspected;
            trashInspectionModel.Producer = trashInspection.Producer;
            trashInspectionModel.RegistrationNumber = trashInspection.Registration_Number;
            trashInspectionModel.Time = trashInspection.Time;
            trashInspectionModel.Transporter = trashInspection.Transporter;
            trashInspectionModel.TrashFraction = trashInspection.Trash_Fraction;
            trashInspectionModel.WeighingNumber = trashInspection.Weighing_Number;

            trashInspectionModel.Update(DbContext);

            Infrastructure.Data.Entities.TrashInspection dbTrashInspection = DbContext.TrashInspections.AsNoTracking().First();
            List<Infrastructure.Data.Entities.TrashInspection> trashInspectionList = DbContext.TrashInspections.AsNoTracking().ToList();

            // Assert
            Assert.NotNull(dbTrashInspection);

            Assert.AreEqual(1, trashInspectionList.Count());

            Assert.AreEqual(trashInspection.Created_at.ToString(), dbTrashInspection.Created_at.ToString());
            Assert.AreEqual(trashInspection.Date.ToString(), dbTrashInspection.Date.ToString());
            Assert.AreEqual(trashInspection.Eak_Code, dbTrashInspection.Eak_Code);
            Assert.AreEqual(trashInspection.Installation_Id, dbTrashInspection.Installation_Id);
            Assert.AreEqual(trashInspection.Must_Be_Inspected, dbTrashInspection.Must_Be_Inspected);
            Assert.AreEqual(trashInspection.Producer, dbTrashInspection.Producer);
            Assert.AreEqual(trashInspection.Registration_Number, dbTrashInspection.Registration_Number);
            Assert.AreEqual(trashInspection.Time.ToString(), dbTrashInspection.Time.ToString());
            Assert.AreEqual(trashInspection.Transporter, dbTrashInspection.Transporter);
            Assert.AreEqual(trashInspection.Trash_Fraction, dbTrashInspection.Trash_Fraction);
            Assert.AreEqual(trashInspection.Weighing_Number, dbTrashInspection.Weighing_Number);
        }
        [Test]
        public void TrashInspectionModel_DeleteWTrue_DoesDelete()
        {
            // Arrange
            Random rnd = new Random();

            Infrastructure.Data.Entities.TrashInspection trashInspection = new Infrastructure.Data.Entities.TrashInspection();
            trashInspection.Created_at = DateTime.Now;
            trashInspection.Date = DateTime.Now;
            trashInspection.Eak_Code = rnd.Next(1, 255);
            trashInspection.Installation_Id = rnd.Next(1, 255);
            trashInspection.Must_Be_Inspected = true;
            trashInspection.Producer = Guid.NewGuid().ToString();
            trashInspection.Registration_Number = Guid.NewGuid().ToString();
            trashInspection.Time = DateTime.Now;
            trashInspection.Transporter = Guid.NewGuid().ToString();
            trashInspection.Trash_Fraction = rnd.Next(1, 255);
            trashInspection.Weighing_Number = rnd.Next(1, 255);

            DbContext.TrashInspections.Add(trashInspection);
            DbContext.SaveChanges();

            // Act
            TrashInspectionModel trashInspectionModel = new TrashInspectionModel();
            trashInspectionModel.CreatedAt = trashInspection.Created_at;
            trashInspectionModel.Date = trashInspection.Date;
            trashInspectionModel.EakCode = trashInspection.Eak_Code;
            trashInspectionModel.Id = trashInspection.Id;
            trashInspectionModel.InstallationId = trashInspection.Installation_Id;
            trashInspectionModel.MustBeInspected = trashInspection.Must_Be_Inspected;
            trashInspectionModel.Producer = trashInspection.Producer;
            trashInspectionModel.RegistrationNumber = trashInspection.Registration_Number;
            trashInspectionModel.Time = trashInspection.Time;
            trashInspectionModel.Transporter = trashInspection.Transporter;
            trashInspectionModel.TrashFraction = trashInspection.Trash_Fraction;
            trashInspectionModel.WeighingNumber = trashInspection.Weighing_Number;

            trashInspectionModel.Delete(DbContext);

            Infrastructure.Data.Entities.TrashInspection dbTrashInspection = DbContext.TrashInspections.AsNoTracking().First();
            List<Infrastructure.Data.Entities.TrashInspection> trashInspectionList = DbContext.TrashInspections.AsNoTracking().ToList();

            // Assert
            Assert.NotNull(dbTrashInspection);

            Assert.AreEqual(1, trashInspectionList.Count());

            Assert.AreEqual(trashInspection.Created_at.ToString(), dbTrashInspection.Created_at.ToString());
            Assert.AreEqual(trashInspection.Date.ToString(), dbTrashInspection.Date.ToString());
            Assert.AreEqual(trashInspection.Eak_Code, dbTrashInspection.Eak_Code);
            Assert.AreEqual(trashInspection.Installation_Id, dbTrashInspection.Installation_Id);
            Assert.AreEqual(trashInspection.Must_Be_Inspected, dbTrashInspection.Must_Be_Inspected);
            Assert.AreEqual(trashInspection.Producer, dbTrashInspection.Producer);
            Assert.AreEqual(trashInspection.Registration_Number, dbTrashInspection.Registration_Number);
            Assert.AreEqual(trashInspection.Time.ToString(), dbTrashInspection.Time.ToString());
            Assert.AreEqual(trashInspection.Transporter, dbTrashInspection.Transporter);
            Assert.AreEqual(trashInspection.Trash_Fraction, dbTrashInspection.Trash_Fraction);
            Assert.AreEqual(trashInspection.Weighing_Number, dbTrashInspection.Weighing_Number);
            Assert.AreEqual(trashInspection.Workflow_state, eFormShared.Constants.WorkflowStates.Removed);
        }
        [Test]
        public void TrashInspectionModel_DeleteWFalse_DoesDelete()
        {
            // Arrange
            Random rnd = new Random();

            Infrastructure.Data.Entities.TrashInspection trashInspection = new Infrastructure.Data.Entities.TrashInspection();
            trashInspection.Created_at = DateTime.Now;
            trashInspection.Date = DateTime.Now;
            trashInspection.Eak_Code = rnd.Next(1, 255);
            trashInspection.Installation_Id = rnd.Next(1, 255);
            trashInspection.Must_Be_Inspected = false;
            trashInspection.Producer = Guid.NewGuid().ToString();
            trashInspection.Registration_Number = Guid.NewGuid().ToString();
            trashInspection.Time = DateTime.Now;
            trashInspection.Transporter = Guid.NewGuid().ToString();
            trashInspection.Trash_Fraction = rnd.Next(1, 255);
            trashInspection.Weighing_Number = rnd.Next(1, 255);

            DbContext.TrashInspections.Add(trashInspection);
            DbContext.SaveChanges();

            // Act
            TrashInspectionModel trashInspectionModel = new TrashInspectionModel();
            trashInspectionModel.CreatedAt = trashInspection.Created_at;
            trashInspectionModel.Date = trashInspection.Date;
            trashInspectionModel.EakCode = trashInspection.Eak_Code;
            trashInspectionModel.Id = trashInspection.Id;
            trashInspectionModel.InstallationId = trashInspection.Installation_Id;
            trashInspectionModel.MustBeInspected = trashInspection.Must_Be_Inspected;
            trashInspectionModel.Producer = trashInspection.Producer;
            trashInspectionModel.RegistrationNumber = trashInspection.Registration_Number;
            trashInspectionModel.Time = trashInspection.Time;
            trashInspectionModel.Transporter = trashInspection.Transporter;
            trashInspectionModel.TrashFraction = trashInspection.Trash_Fraction;
            trashInspectionModel.WeighingNumber = trashInspection.Weighing_Number;

            trashInspectionModel.Delete(DbContext);

            Infrastructure.Data.Entities.TrashInspection dbTrashInspection = DbContext.TrashInspections.AsNoTracking().First();
            List<Infrastructure.Data.Entities.TrashInspection> trashInspectionList = DbContext.TrashInspections.AsNoTracking().ToList();

            // Assert
            Assert.NotNull(dbTrashInspection);

            Assert.AreEqual(1, trashInspectionList.Count());

            Assert.AreEqual(trashInspection.Created_at.ToString(), dbTrashInspection.Created_at.ToString());
            Assert.AreEqual(trashInspection.Date.ToString(), dbTrashInspection.Date.ToString());
            Assert.AreEqual(trashInspection.Eak_Code, dbTrashInspection.Eak_Code);
            Assert.AreEqual(trashInspection.Installation_Id, dbTrashInspection.Installation_Id);
            Assert.AreEqual(trashInspection.Must_Be_Inspected, dbTrashInspection.Must_Be_Inspected);
            Assert.AreEqual(trashInspection.Producer, dbTrashInspection.Producer);
            Assert.AreEqual(trashInspection.Registration_Number, dbTrashInspection.Registration_Number);
            Assert.AreEqual(trashInspection.Time.ToString(), dbTrashInspection.Time.ToString());
            Assert.AreEqual(trashInspection.Transporter, dbTrashInspection.Transporter);
            Assert.AreEqual(trashInspection.Trash_Fraction, dbTrashInspection.Trash_Fraction);
            Assert.AreEqual(trashInspection.Weighing_Number, dbTrashInspection.Weighing_Number);
            Assert.AreEqual(trashInspection.Workflow_state, eFormShared.Constants.WorkflowStates.Removed);

        }
    }
}
