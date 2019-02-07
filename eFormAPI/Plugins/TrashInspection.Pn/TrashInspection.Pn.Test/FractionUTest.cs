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
    public class FractionUTest : DbTestFixture
    {
        [Test]
        public void FractionModel_Save_DoesSave()
        {
            //Arrange
            Random rnd = new Random();
            
            FractionModel fraction = new FractionModel();
            fraction.Name = Guid.NewGuid().ToString();
            fraction.Description = Guid.NewGuid().ToString();
            fraction.eFormId = rnd.Next(1, 355);
            fraction.SelectedTemplateName = Guid.NewGuid().ToString();
            
            //Act
            fraction.Save(DbContext);

            Fraction dbFraction = DbContext.Fractions.AsNoTracking().First();
            List<Fraction> fractionList = DbContext.Fractions.AsNoTracking().ToList();
            //Assert
            Assert.NotNull(dbFraction);
            
            Assert.AreEqual(1, fractionList.Count());
            
            Assert.AreEqual(fraction.Name, dbFraction.Name);
            Assert.AreEqual(fraction.Description, dbFraction.Description);
            Assert.AreEqual(fraction.eFormId, dbFraction.eFormId);
//            Assert.AreEqual(fraction.SelectedTemplateName, dbFraction.SelectedTemplateName); //needs to be added to entity
        }
 
        [Test]
        public void FractionModel_Update_DoesUpdate()
        {
            //Arrange
            Random rnd = new Random();
            Fraction fraction = new Fraction();
            fraction.Name = Guid.NewGuid().ToString();
            fraction.Description = Guid.NewGuid().ToString();
            fraction.eFormId = rnd.Next(1, 355);
//            fraction.SelectedTemplateName = Guid.NewGuid().ToString();//needs to be added to entity

            DbContext.Fractions.Add(fraction);
            DbContext.SaveChanges();
            
            //Act
            FractionModel fractionModel = new FractionModel();
            fractionModel.Name = Guid.NewGuid().ToString();
            fractionModel.Description = Guid.NewGuid().ToString();
            fractionModel.eFormId = rnd.Next(1,255);
            fractionModel.CreatedAt = fraction.CreatedAt;
            fractionModel.Id = fraction.Id;
            
            fractionModel.Update(DbContext);
            
            Fraction dbFraction = DbContext.Fractions.AsNoTracking().First();
            List<Fraction> fractionList = DbContext.Fractions.AsNoTracking().ToList();
            List<FractionVersion> fractionVersions = DbContext.FractionVersions.AsNoTracking().ToList();

            //Assert
            Assert.NotNull(dbFraction);
            
            Assert.AreEqual(1, fractionList.Count());
            Assert.AreEqual(1, fractionVersions.Count());
            
            Assert.AreEqual(fractionModel.Name, dbFraction.Name);
            Assert.AreEqual(fractionModel.Description, dbFraction.Description);
            Assert.AreEqual(fractionModel.eFormId, dbFraction.eFormId);
            Assert.AreEqual(fractionModel.CreatedAt, dbFraction.CreatedAt);
        }
        [Test]
        public void FractionModel_Delete_DoesSetWorkflowStateToRemoved()
        {
            //Arrange
            Random rnd = new Random();
            Fraction fraction = new Fraction();
            fraction.Name = Guid.NewGuid().ToString();
            fraction.Description = Guid.NewGuid().ToString();
            fraction.eFormId = rnd.Next(1, 355);
//            fraction.SelectedTemplateName = Guid.NewGuid().ToString();//needs to be added to entity

            DbContext.Fractions.Add(fraction);
            DbContext.SaveChanges();
            
            //Act
            FractionModel fractionModel = new FractionModel();
            fractionModel.Name = fraction.Name;
            fractionModel.Description = fraction.Description;
            fractionModel.eFormId = fraction.eFormId;
            fractionModel.CreatedAt = fraction.CreatedAt;
            fractionModel.Id = fraction.Id;
            
            fractionModel.Delete(DbContext);
            
            Fraction dbFraction = DbContext.Fractions.AsNoTracking().First();
            List<Fraction> fractionList = DbContext.Fractions.AsNoTracking().ToList();
            List<FractionVersion> fractionVersions = DbContext.FractionVersions.AsNoTracking().ToList();

            //Assert
            Assert.NotNull(dbFraction);
            
            Assert.AreEqual(1, fractionList.Count());
            Assert.AreEqual(1, fractionVersions.Count());
            
            Assert.AreEqual(fractionModel.Name, dbFraction.Name);
            Assert.AreEqual(fractionModel.Description, dbFraction.Description);
            Assert.AreEqual(fractionModel.eFormId, dbFraction.eFormId);
            Assert.AreEqual(fractionModel.CreatedAt, dbFraction.CreatedAt);
            Assert.AreEqual(fraction.WorkflowState, eFormShared.Constants.WorkflowStates.Removed);
        }
        
    }
}