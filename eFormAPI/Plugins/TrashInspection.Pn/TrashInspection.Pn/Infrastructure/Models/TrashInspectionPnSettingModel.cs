using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using eFormShared;
using System.Threading.Tasks;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class TrashInspectionPnSettingModel : IDataAccessObject<TrashInspectionPnDbContext>
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


        public async Task Save(TrashInspectionPnDbContext dbContext)
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

            
            dbContext.TrashInspectionPnSettings.Add(trashInspectionPnSetting);
            dbContext.SaveChanges();

            dbContext.TrashInspectionPnSettingVersions.Add(MapTrashInspectionPnSettingVersion(dbContext, trashInspectionPnSetting));
            dbContext.SaveChanges();
        }

        public void Create(TrashInspectionPnDbContext dbContext)
        {
            throw new NotImplementedException();
        }

        public void Update(TrashInspectionPnDbContext dbContext)
        {
            
            TrashInspectionPnSetting trashInspectionPnSetting = dbContext.TrashInspectionPnSettings.FirstOrDefault(x => x.Name == Name);

            if( trashInspectionPnSetting == null)
            {
                throw new NullReferenceException($"Could not find TrashInspectionPnSettings with Name: {Name}");
            }
            trashInspectionPnSetting.Value = Value;

            if (dbContext.ChangeTracker.HasChanges())
            {
                trashInspectionPnSetting.UpdatedAt = DateTime.Now;
                trashInspectionPnSetting.UpdatedByUserId = UpdatedByUserId;
                trashInspectionPnSetting.Version += 1;

                dbContext.TrashInspectionPnSettingVersions.Add(MapTrashInspectionPnSettingVersion(dbContext, trashInspectionPnSetting));
                dbContext.SaveChanges();
            }

        }

        public void Delete(TrashInspectionPnDbContext dbContext)
        {

            TrashInspectionPnSetting trashInspectionPnSetting = dbContext.TrashInspectionPnSettings.FirstOrDefault(x => x.Name == Name);

            if (trashInspectionPnSetting == null)
            {
                throw new NullReferenceException($"Could not find trashInspectionPnSetting with Name: {Name}");
            }
            trashInspectionPnSetting.WorkflowState = Constants.WorkflowStates.Removed;

            if (dbContext.ChangeTracker.HasChanges())
            {
                trashInspectionPnSetting.UpdatedAt = DateTime.Now;
                trashInspectionPnSetting.UpdatedByUserId = UpdatedByUserId;
                trashInspectionPnSetting.Version += 1;
                dbContext.TrashInspectionPnSettingVersions.Add(MapTrashInspectionPnSettingVersion(dbContext, trashInspectionPnSetting));
                dbContext.SaveChanges();
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