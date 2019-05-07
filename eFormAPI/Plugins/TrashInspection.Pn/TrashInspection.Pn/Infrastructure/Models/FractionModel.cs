using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using eFormShared;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class FractionModel : IModel
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
        public int eFormId { get; set; }
        public string SelectedTemplateName { get; set; }
        public string Description { get; set; }
        public string ItemNumber { get; set; }
        public string LocationCode { get; set; }

        public async Task Save(TrashInspectionPnDbContext _dbContext)
        {
            Fraction fraction = new Fraction();
            fraction.CreatedAt = DateTime.Now;
            fraction.CreatedByUserId = CreatedByUserId;
            fraction.Description = Description;
            fraction.Name = Name;
            fraction.UpdatedAt = DateTime.Now;
            fraction.UpdatedByUserId = UpdatedByUserId;
            fraction.Version = Version;
            fraction.eFormId = eFormId;
            fraction.ItemNumber = ItemNumber;
            fraction.LocationCode = LocationCode;
            fraction.WorkflowState = Constants.WorkflowStates.Created;
            
            _dbContext.Fractions.Add(fraction);
            _dbContext.SaveChanges();

            _dbContext.FractionVersions.Add(MapFractionVersion(_dbContext, fraction));
            _dbContext.SaveChanges();
            Id = fraction.Id;


        }
        public async Task Update(TrashInspectionPnDbContext _dbContext)
        {
            Fraction fraction = _dbContext.Fractions.FirstOrDefault(x => x.Id == Id);

            if (fraction == null)
            {
                throw new NullReferenceException($"Could not find fraction with id: {Id}");
            }

            fraction.Name = Name;
            fraction.Description = Description;
            fraction.eFormId = eFormId;
            fraction.LocationCode = LocationCode;
            fraction.ItemNumber = ItemNumber;

            if (_dbContext.ChangeTracker.HasChanges())
            {
                fraction.UpdatedAt = DateTime.Now;
                fraction.UpdatedByUserId = UpdatedByUserId;
                fraction.Version += 1;

                _dbContext.FractionVersions.Add(MapFractionVersion(_dbContext, fraction));
                _dbContext.SaveChanges();
            }

        }
        public async Task Delete(TrashInspectionPnDbContext _dbContext)
        {
            Fraction fraction = _dbContext.Fractions.FirstOrDefault(x => x.Id == Id);

            if (fraction == null)
            {
                throw new NullReferenceException($"Could not find fraction with id: {Id}");
            }

            fraction.WorkflowState = Constants.WorkflowStates.Removed;

            if (_dbContext.ChangeTracker.HasChanges())
            {
                fraction.UpdatedAt = DateTime.Now;
                fraction.UpdatedByUserId = UpdatedByUserId;
                fraction.Version += 1;

                _dbContext.FractionVersions.Add(MapFractionVersion(_dbContext, fraction));
                _dbContext.SaveChanges();
            }

        }

        private FractionVersion MapFractionVersion(TrashInspectionPnDbContext _dbContext, Fraction fraction)
        {
            FractionVersion fractionVer = new FractionVersion();

            fractionVer.Name = fraction.Name;
            fractionVer.Description = fraction.Description;
            fractionVer.Version = fraction.Version;
            fractionVer.CreatedAt = fraction.CreatedAt;
            fractionVer.CreatedByUserId = fraction.CreatedByUserId;
            fractionVer.UpdatedAt = fraction.UpdatedAt;
            fractionVer.UpdatedByUserId = fraction.UpdatedByUserId;
            fractionVer.WorkflowState = fraction.WorkflowState;
            fractionVer.eFormId = fraction.eFormId;
            fractionVer.ItemNumber = fraction.ItemNumber;
            fractionVer.LocationCode = fraction.LocationCode;

            return fractionVer;
        }
    }
}