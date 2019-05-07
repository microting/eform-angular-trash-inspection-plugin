using System;
using System.ComponentModel.DataAnnotations;
using eFormShared;
using System.Linq;
using System.Threading.Tasks;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class TrashInspectionPnSettingModel : IModel
    {
        public int Id { get; set; }
        public string Value { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        [StringLength(255)]
        public string WorkflowState { get; set; }
        public int Version { get; set; }
        public int CreatedByUserId { get; set; }
        public int UpdatedByUserId { get; set; }
        public string Name { get; set; }


        public async Task Save(TrashInspectionPnDbContext _dbcontext)
        {
            
            TrashInspectionPnSetting trashInspectionPnSetting = new TrashInspectionPnSetting();
            if (CreatedAt != null) {
                trashInspectionPnSetting.CreatedAt = (DateTime)CreatedAt;                
            }
            trashInspectionPnSetting.CreatedByUserId = CreatedByUserId;
            trashInspectionPnSetting.Name = Name;
            trashInspectionPnSetting.Value = Value;
            trashInspectionPnSetting.UpdatedAt = DateTime.Now;
            trashInspectionPnSetting.UpdatedByUserId = UpdatedByUserId;
            trashInspectionPnSetting.Version = Version;
            trashInspectionPnSetting.WorkflowState = Constants.WorkflowStates.Created;

            
            _dbcontext.TrashInspectionPnSettings.Add(trashInspectionPnSetting);
            _dbcontext.SaveChanges();

            _dbcontext.TrashInspectionPnSettingVersions.Add(MapTrashInspectionPnSettingVersion(_dbcontext, trashInspectionPnSetting));
            _dbcontext.SaveChanges();
        }

        public async Task Update(TrashInspectionPnDbContext _dbcontext)
        {
            
            TrashInspectionPnSetting trashInspectionPnSetting = _dbcontext.TrashInspectionPnSettings.FirstOrDefault(x => x.Name == Name);

            if( trashInspectionPnSetting == null)
            {
                throw new NullReferenceException($"Could not find TrashInspectionPnSettings with Name: {Name}");
            }
            trashInspectionPnSetting.Value = Value;

            if (_dbcontext.ChangeTracker.HasChanges())
            {
                trashInspectionPnSetting.UpdatedAt = DateTime.Now;
                trashInspectionPnSetting.UpdatedByUserId = UpdatedByUserId;
                trashInspectionPnSetting.Version += 1;

                _dbcontext.TrashInspectionPnSettingVersions.Add(MapTrashInspectionPnSettingVersion(_dbcontext, trashInspectionPnSetting));
                _dbcontext.SaveChanges();
            }

        }

        public async Task Delete(TrashInspectionPnDbContext _dbcontext)
        {

            TrashInspectionPnSetting trashInspectionPnSetting = _dbcontext.TrashInspectionPnSettings.FirstOrDefault(x => x.Name == Name);

            if (trashInspectionPnSetting == null)
            {
                throw new NullReferenceException($"Could not find trashInspectionPnSetting with Name: {Name}");
            }
            trashInspectionPnSetting.WorkflowState = Constants.WorkflowStates.Removed;

            if (_dbcontext.ChangeTracker.HasChanges())
            {
                trashInspectionPnSetting.UpdatedAt = DateTime.Now;
                trashInspectionPnSetting.UpdatedByUserId = UpdatedByUserId;
                trashInspectionPnSetting.Version += 1;
                _dbcontext.TrashInspectionPnSettingVersions.Add(MapTrashInspectionPnSettingVersion(_dbcontext, trashInspectionPnSetting));
                _dbcontext.SaveChanges();
            }

        }

        private TrashInspectionPnSettingVersion MapTrashInspectionPnSettingVersion(TrashInspectionPnDbContext _dbContext, TrashInspectionPnSetting trashInspectionPnSetting)
        {
            TrashInspectionPnSettingVersion trashInspectionPnSettingVersion = new TrashInspectionPnSettingVersion();

            trashInspectionPnSettingVersion.CreatedAt = trashInspectionPnSetting.CreatedAt;
            trashInspectionPnSettingVersion.CreatedByUserId = trashInspectionPnSetting.CreatedByUserId;
            trashInspectionPnSettingVersion.Name = trashInspectionPnSetting.Name;
            trashInspectionPnSettingVersion.Value = trashInspectionPnSetting.Value;
            trashInspectionPnSettingVersion.UpdatedAt = trashInspectionPnSetting.UpdatedAt;
            trashInspectionPnSettingVersion.UpdatedByUserId = trashInspectionPnSetting.UpdatedByUserId;
            trashInspectionPnSettingVersion.Version = trashInspectionPnSetting.Version;
            trashInspectionPnSettingVersion.WorkflowState = trashInspectionPnSetting.WorkflowState;

            trashInspectionPnSettingVersion.TrashInspectionPnSettingId = trashInspectionPnSetting.Id;

            return trashInspectionPnSettingVersion;
        }
    }
}