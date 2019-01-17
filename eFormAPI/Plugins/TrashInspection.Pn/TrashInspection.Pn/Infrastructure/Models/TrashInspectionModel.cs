using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using TrashInspection.Pn.Infrastructure.Data;
using TrashInspection.Pn.Infrastructure.Data.Entities;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class TrashInspectionModel : IModel
    {
        public int Id { get; set; }
        public DateTime? Created_at { get; set; }
        public DateTime? Updated_at { get; set; }
        [StringLength(255)]
        public string Workflow_state { get; set; }
        public int Version { get; set; }
        public int Created_By_User_Id { get; set; }
        public int Updated_By_User_Id { get; set; }
        public int Weighing_Number { get; set; }
        public DateTime Date { get; set; }
        public DateTime Time { get; set; }
        public string Registration_Number { get; set; }
        public int Trash_Fraction { get; set; }
        public int Eak_Code { get; set; }
        public string Producer { get; set; }
        public string Transporter { get; set; }
        public int Installation_Id { get; set; }
        public bool Must_Be_Inspected { get; set; }

        public void Save(TrashInspectionPnDbContext _dbContext)
        {
            Data.Entities.TrashInspection trashInspection = new Data.Entities.TrashInspection();
            trashInspection.Created_at = Created_at;
            trashInspection.Created_By_User_Id = Created_By_User_Id;
            trashInspection.Date = Date;
            trashInspection.Eak_Code = Eak_Code;
            trashInspection.Installation_Id = Installation_Id;
            trashInspection.Must_Be_Inspected = Must_Be_Inspected;
            trashInspection.Producer = Producer;
            trashInspection.Registration_Number = Registration_Number;
            trashInspection.Time = Time;
            trashInspection.Transporter = Transporter;
            trashInspection.Trash_Fraction = Trash_Fraction;
            trashInspection.Updated_at = DateTime.Now;
            trashInspection.Updated_By_User_Id = Updated_By_User_Id;
            trashInspection.Version = Version;
            trashInspection.Weighing_Number = Weighing_Number;
            trashInspection.Workflow_state = eFormShared.Constants.WorkflowStates.Created;

            _dbContext.TrashInspections.Add(trashInspection);
            _dbContext.SaveChanges();

            _dbContext.TrashInspectionVersions.Add(MapTrashInspectionVersion(_dbContext, trashInspection));
            _dbContext.SaveChanges();
        }

        public void Update(TrashInspectionPnDbContext _dbContext)
        {
            Data.Entities.TrashInspection trashInspection = _dbContext.TrashInspections.FirstOrDefault(x => x.Id == Id);

            if (trashInspection == null)
            {
                throw new NullReferenceException($"Could not find Trash Inspection with ID: {Id}");
            }
            trashInspection.Date = Date;
            trashInspection.Eak_Code = Eak_Code;
            trashInspection.Installation_Id = Installation_Id;
            trashInspection.Must_Be_Inspected = Must_Be_Inspected;
            trashInspection.Producer = Producer;
            trashInspection.Registration_Number = Registration_Number;
            trashInspection.Time = Time;
            trashInspection.Transporter = Transporter;
            trashInspection.Trash_Fraction = Trash_Fraction;
            trashInspection.Weighing_Number = Weighing_Number;

            if (_dbContext.ChangeTracker.HasChanges())
            {
                trashInspection.Updated_at = DateTime.Now;
                trashInspection.Version += 1;

                _dbContext.TrashInspectionVersions.Add(MapTrashInspectionVersion(_dbContext, trashInspection));
                _dbContext.SaveChanges();
            }
        }

        public void Delete(TrashInspectionPnDbContext _dbContext)
        {
            Data.Entities.TrashInspection trashInspection = _dbContext.TrashInspections.FirstOrDefault(x => x.Id == Id);

            if(trashInspection == null)
            {
                throw new NullReferenceException($"Could not find Trash Inspection with id: {Id}");
            }

            trashInspection.Workflow_state = eFormShared.Constants.WorkflowStates.Removed;

            if (_dbContext.ChangeTracker.HasChanges())
            {
                trashInspection.Updated_at = DateTime.Now;
                trashInspection.Version += 1;
                //_dbContext.TrashInspections.Remove(trashInspection);
                _dbContext.TrashInspectionVersions.Add(MapTrashInspectionVersion(_dbContext, trashInspection));
                _dbContext.SaveChanges();

            }

        }

        private TrashInspectionVersion MapTrashInspectionVersion(TrashInspectionPnDbContext _dbContext, Data.Entities.TrashInspection trashInspection)
        {
            TrashInspectionVersion trashInspectionVer = new TrashInspectionVersion();

            trashInspectionVer.Created_at = trashInspection.Created_at;
            trashInspectionVer.Created_By_User_Id = trashInspection.Created_By_User_Id;
            trashInspectionVer.Date = trashInspection.Date;
            trashInspectionVer.Eak_Code = trashInspection.Eak_Code;
            trashInspectionVer.Installation_Id = trashInspection.Installation_Id;
            trashInspectionVer.Must_Be_Inspected = trashInspection.Must_Be_Inspected;
            trashInspectionVer.Producer = trashInspection.Producer;
            trashInspectionVer.Registration_Number = trashInspection.Registration_Number;
            trashInspectionVer.Time = trashInspection.Time;
            trashInspectionVer.Transporter = trashInspection.Transporter;
            trashInspectionVer.Trash_Fraction = trashInspection.Trash_Fraction;
            trashInspectionVer.Updated_at = trashInspection.Updated_at;
            trashInspectionVer.Updated_By_User_Id = trashInspection.Updated_By_User_Id;
            trashInspectionVer.Version = trashInspection.Version;
            trashInspectionVer.Weighing_Number = trashInspection.Weighing_Number;
            trashInspectionVer.Workflow_state = trashInspection.Workflow_state;

            trashInspectionVer.Trash_Inspction_Id = trashInspection.Id;
            
            return trashInspectionVer;
        }
    }
}
