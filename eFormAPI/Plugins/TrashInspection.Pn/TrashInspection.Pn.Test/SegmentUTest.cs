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
    public class SegmentUTest : DbTestFixture
    {
        [Test]
        public async Task SegmentModel_Save_DoesSave()
        {
            //Arrange 
            Random rnd = new Random();
            
            SegmentModel segmentModel = new SegmentModel();
            segmentModel.Name = Guid.NewGuid().ToString();
            segmentModel.Description = Guid.NewGuid().ToString();
            segmentModel.SdkFolderId = rnd.Next(1, 255);
            
            //Act
            await segmentModel.Save(DbContext);

            Segment dbSegment = DbContext.Segments.AsNoTracking().First();
            List<Segment> segmentList = DbContext.Segments.AsNoTracking().ToList();
            
            //Assert
            Assert.NotNull(dbSegment);

            Assert.AreEqual(1, segmentList.Count());
            
            Assert.AreEqual(segmentModel.Name, dbSegment.Name);
            Assert.AreEqual(segmentModel.Description, dbSegment.Description);
            Assert.AreEqual(segmentModel.SdkFolderId, dbSegment.SdkFolderId);
        }

        [Test]
        public async Task SegmentModel_Update_DoesUpdate()
        {
            //Arrange
            Random rnd = new Random();
            
            Segment segment = new Segment();
            segment.CreatedAt = DateTime.Now;
            segment.Description = Guid.NewGuid().ToString();
            segment.Name = Guid.NewGuid().ToString();
            segment.SdkFolderId = rnd.Next(1, 255);

            DbContext.Segments.Add(segment);
            await DbContext.SaveChangesAsync();

            //Act

            SegmentModel segmentModel = new SegmentModel();
            segmentModel.Name = Guid.NewGuid().ToString();
            segmentModel.Description = Guid.NewGuid().ToString();
            segmentModel.SdkFolderId = rnd.Next(1, 255);
            segmentModel.Id = segment.Id;
            
            await segmentModel.Update(DbContext);
            
            Segment dbSegment = DbContext.Segments.AsNoTracking().First();
            List<Segment> segmentList = DbContext.Segments.AsNoTracking().ToList();
            List<SegmentVersion> segmentVersions = DbContext.SegmentVersions.AsNoTracking().ToList();
            
            //Assert
            Assert.NotNull(dbSegment);

            Assert.AreEqual(1, segmentList.Count());
            Assert.AreEqual(1, segmentVersions.Count());
            
            Assert.AreEqual(segmentModel.Name, dbSegment.Name);
            Assert.AreEqual(segmentModel.Description, dbSegment.Description);
            Assert.AreEqual(segmentModel.SdkFolderId, dbSegment.SdkFolderId);
        }
        [Test]
        public async Task SegmentModel_Delete_DoesDelete()
        {
            //Arrange
            Random rnd = new Random();
            
            Segment segment = new Segment();
            segment.CreatedAt = DateTime.Now;
            segment.Description = Guid.NewGuid().ToString();
            segment.Name = Guid.NewGuid().ToString();
            segment.SdkFolderId = rnd.Next(1, 255);

            DbContext.Segments.Add(segment);
            await DbContext.SaveChangesAsync();

            //Act

            SegmentModel segmentModel = new SegmentModel();
            segmentModel.Name = segment.Name;
            segmentModel.Description = segment.Description;
            segmentModel.SdkFolderId = segment.SdkFolderId;
            segmentModel.Id = segment.Id;
            
            await segmentModel.Delete(DbContext);
            
            Segment dbSegment = DbContext.Segments.AsNoTracking().First();
            List<Segment> segmentList = DbContext.Segments.AsNoTracking().ToList();
            List<SegmentVersion> segmentVersions = DbContext.SegmentVersions.AsNoTracking().ToList();
            
            //Assert
            Assert.NotNull(dbSegment);

            Assert.AreEqual(1, segmentList.Count());
            Assert.AreEqual(1, segmentVersions.Count());
            
            Assert.AreEqual(segmentModel.Name, dbSegment.Name);
            Assert.AreEqual(segmentModel.Description, dbSegment.Description);
            Assert.AreEqual(segmentModel.SdkFolderId, dbSegment.SdkFolderId);
            Assert.AreEqual(dbSegment.WorkflowState, eFormShared.Constants.WorkflowStates.Removed);
        }
    }
}