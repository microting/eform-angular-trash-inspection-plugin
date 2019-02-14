using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using eFormShared;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class SegmentModel : IModel
    {
        public int Id { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        [StringLength(255)]
        public string WorkflowState { get; set; }
        public int Version { get; set; }
        public int CreatedByUserId { get; set; }
        public int UpdatedByUserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int SdkFolderId { get; set; }
        
        
        public async Task Save(TrashInspectionPnDbContext _dbContext)
        {
            
            Segment segment = new Segment();
            segment.CreatedAt = DateTime.Now;
            segment.CreatedByUserId = CreatedByUserId;
            segment.Description = Description;
            segment.Name = Name;
            segment.SdkFolderId = SdkFolderId;
            segment.UpdatedAt = DateTime.Now;
            segment.UpdatedByUserId = UpdatedByUserId;
            segment.Version = Version;
            segment.WorkflowState = Constants.WorkflowStates.Created;

            _dbContext.Segments.Add(segment);
            _dbContext.SaveChanges();

            _dbContext.SegmentVersions.Add(MapSegmentVersion(_dbContext, segment));
            _dbContext.SaveChanges();
        }

        public async Task Update(TrashInspectionPnDbContext _dbContext)
        {
            
            Segment segment = _dbContext.Segments.FirstOrDefault(x => x.Id == Id);

            if (segment == null)
            {
                throw new NullReferenceException($"Could not find fraction with id: {Id}");
            }

            segment.Name = Name;
            segment.Description = Description;
            segment.SdkFolderId = SdkFolderId;

            if (_dbContext.ChangeTracker.HasChanges())
            {
                segment.UpdatedAt = DateTime.Now;
                segment.UpdatedByUserId = UpdatedByUserId;
                segment.Version += 1;

                _dbContext.SegmentVersions.Add(MapSegmentVersion(_dbContext, segment));
                _dbContext.SaveChanges();
            }

        }

        public async Task Delete(TrashInspectionPnDbContext _dbContext)
        {
            
            Segment segment = _dbContext.Segments.FirstOrDefault(x => x.Id == Id);

            if (segment == null)
            {
                throw new NullReferenceException($"Could not find segment with id: {Id}");
            }

            segment.WorkflowState = Constants.WorkflowStates.Removed;

            if (_dbContext.ChangeTracker.HasChanges())
            {
                segment.UpdatedAt = DateTime.Now;
                segment.UpdatedByUserId = UpdatedByUserId;
                segment.Version += 1;

                _dbContext.SegmentVersions.Add(MapSegmentVersion(_dbContext, segment));
                _dbContext.SaveChanges();
            }

        }

        private SegmentVersion MapSegmentVersion(TrashInspectionPnDbContext _dbContext, Segment segment)
        {
            SegmentVersion segmentVersion = new SegmentVersion();

            segmentVersion.Name = segment.Name;
            segmentVersion.Description = segment.Description;
            segmentVersion.Version = segment.Version;
            segmentVersion.CreatedAt = segment.CreatedAt;
            segmentVersion.CreatedByUserId = segment.CreatedByUserId;
            segmentVersion.UpdatedAt = segment.UpdatedAt;
            segmentVersion.UpdatedByUserId = segment.UpdatedByUserId;
            segmentVersion.WorkflowState = segment.WorkflowState;

            return segmentVersion;
        }
    }
}