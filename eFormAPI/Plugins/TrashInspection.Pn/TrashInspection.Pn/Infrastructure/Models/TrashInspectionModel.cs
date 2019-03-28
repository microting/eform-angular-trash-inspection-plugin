using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class TrashInspectionModel : IModel
    {
        public int Id { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        [StringLength(255)]
        public string WorkflowState { get; set; }
        public int Version { get; set; }
        public int CreatedByUserId { get; set; }
        public int UpdatedByUserId { get; set; }
        public string WeighingNumber { get; set; }
        public DateTime Date { get; set; }
        public DateTime Time { get; set; }
        public string RegistrationNumber { get; set; }
        public string TrashFraction { get; set; }
        public string EakCode { get; set; }
        public string Producer { get; set; }
        public string Transporter { get; set; }
        public string InstallationName { get; set; }
        public string Token { get; set; }
        public int? InstallationId { get; set; }
        public int? SegmentId { get; set; }
        public int? FractionId { get; set; }
        public bool MustBeInspected { get; set; }
        public int Status { get; set; }
        public string Segment { get; set; }
        public bool IsApproved { get; set; }
        public bool InspectionDone { get; set; }
        public bool ExtendedInspection { get; set; }
        public string Comment { get; set; }


        public async Task Save(TrashInspectionPnDbContext _dbContext)
        {
            Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection trashInspection = new Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection();            

            trashInspection.CreatedAt = DateTime.Now;
            trashInspection.UpdatedAt = DateTime.Now;
            trashInspection.CreatedByUserId = CreatedByUserId;
            trashInspection.Date = Date;
            trashInspection.Eak_Code = EakCode;
            if (InstallationId != null) trashInspection.InstallationId = (int)InstallationId;
            if (SegmentId != null) trashInspection.SegmentId = (int)SegmentId;
            if (FractionId != null) trashInspection.FractionId = (int)FractionId;
            trashInspection.MustBeInspected = MustBeInspected;
            trashInspection.Producer = Producer;
            trashInspection.RegistrationNumber = RegistrationNumber;
            trashInspection.Time = Time;
            trashInspection.Transporter = Transporter;
            trashInspection.TrashFraction = TrashFraction;
            trashInspection.UpdatedByUserId = UpdatedByUserId;
            trashInspection.Version = Version;
            trashInspection.WeighingNumber = WeighingNumber;
            trashInspection.Status = Status;
            trashInspection.WorkflowState = eFormShared.Constants.WorkflowStates.Created;
            trashInspection.InspectionDone = InspectionDone;
            trashInspection.ExtendedInspection = ExtendedInspection;

            _dbContext.TrashInspections.Add(trashInspection);
            _dbContext.SaveChanges();

            _dbContext.TrashInspectionVersions.Add(MapTrashInspectionVersion(_dbContext, trashInspection));
            _dbContext.SaveChanges();
            Id = trashInspection.Id;
        }

        public async Task Update(TrashInspectionPnDbContext _dbContext)
        {
            Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection trashInspection = _dbContext.TrashInspections.FirstOrDefault(x => x.Id == Id);

            if (trashInspection == null)
            {
                throw new NullReferenceException($"Could not find Trash Inspection with ID: {Id}");
            }
            trashInspection.Date = Date;
            trashInspection.Eak_Code = EakCode;
            if (InstallationId != null) trashInspection.InstallationId = (int) InstallationId;
            if (FractionId != null) trashInspection.FractionId = (int) FractionId;
            if (SegmentId != null) trashInspection.SegmentId = (int) SegmentId;
            trashInspection.MustBeInspected = MustBeInspected;
            trashInspection.Producer = Producer;
            trashInspection.RegistrationNumber = RegistrationNumber;
            trashInspection.Time = Time;
            trashInspection.Transporter = Transporter;
            trashInspection.TrashFraction = TrashFraction;
            trashInspection.WeighingNumber = WeighingNumber;
            trashInspection.Status = Status;
            trashInspection.InspectionDone = InspectionDone;
            trashInspection.ExtendedInspection = ExtendedInspection;

            if (_dbContext.ChangeTracker.HasChanges())
            {
                trashInspection.UpdatedAt = DateTime.Now;
                trashInspection.Version += 1;

                _dbContext.TrashInspectionVersions.Add(MapTrashInspectionVersion(_dbContext, trashInspection));
                _dbContext.SaveChanges();
            }

        }

        public async Task Delete(TrashInspectionPnDbContext _dbContext)
        {
            Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection trashInspection = _dbContext.TrashInspections.FirstOrDefault(x => x.Id == Id);

            if(trashInspection == null)
            {
                throw new NullReferenceException($"Could not find Trash Inspection with id: {Id}");
            }

            trashInspection.WorkflowState = eFormShared.Constants.WorkflowStates.Removed;

            if (_dbContext.ChangeTracker.HasChanges())
            {
                trashInspection.UpdatedAt = DateTime.Now;
                trashInspection.Version += 1;
                //_dbContext.TrashInspections.Remove(trashInspection);
                _dbContext.TrashInspectionVersions.Add(MapTrashInspectionVersion(_dbContext, trashInspection));
                _dbContext.SaveChanges();

            }


        }

        private TrashInspectionVersion MapTrashInspectionVersion(TrashInspectionPnDbContext _dbContext, Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection trashInspection)
        {
            TrashInspectionVersion trashInspectionVer = new TrashInspectionVersion();

            trashInspectionVer.CreatedAt = trashInspection.CreatedAt;
            trashInspectionVer.CreatedByUserId = trashInspection.CreatedByUserId;
            trashInspectionVer.Date = trashInspection.Date;
            trashInspectionVer.EakCode = trashInspection.Eak_Code;
            trashInspectionVer.InstallationId = trashInspection.InstallationId;
            trashInspectionVer.MustBeInspected = trashInspection.MustBeInspected;
            trashInspectionVer.Producer = trashInspection.Producer;
            trashInspectionVer.RegistrationNumber = trashInspection.RegistrationNumber;
            trashInspectionVer.Time = trashInspection.Time;
            trashInspectionVer.Transporter = trashInspection.Transporter;
            trashInspectionVer.TrashFraction = trashInspection.TrashFraction;
            trashInspectionVer.UpdatedAt = trashInspection.UpdatedAt;
            trashInspectionVer.UpdatedByUserId = trashInspection.UpdatedByUserId;
            trashInspectionVer.Version = trashInspection.Version;
            trashInspectionVer.WeighingNumber = trashInspection.WeighingNumber;
            trashInspectionVer.WorkflowState = trashInspection.WorkflowState;
            trashInspectionVer.InspectionDone = trashInspection.InspectionDone;
            trashInspectionVer.ExtendedInspection = trashInspection.ExtendedInspection;
//            trashInspectionVer.Status = trashInspection.Status;

            trashInspectionVer.TrashInspectionId = trashInspection.Id;
            
            return trashInspectionVer;
        }
    }
}
