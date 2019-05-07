using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using Castle.DynamicProxy;
using eFormShared;
using Microsoft.EntityFrameworkCore;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class TransporterModel : IModel
    {
        public int Id { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        [StringLength(255)]
        public string WorkflowState { get; set; }
        public int CreatedByUserId { get; set; }
        public int UpdatedByUserId { get; set; }
        public int Version { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string ForeignId { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public string ZipCode { get; set; }

        public string Phone { get; set; }

        public string ContactPerson { get; set; }


        public async Task Save(TrashInspectionPnDbContext dbContext)
        {
            Transporter transporter = new Transporter();
            transporter.CreatedAt = DateTime.Now;
            transporter.UpdatedAt = DateTime.Now;
            transporter.CreatedByUserId = CreatedByUserId;
            transporter.UpdatedByUserId = UpdatedByUserId;
            transporter.Version = 1;
            transporter.WorkflowState = Constants.WorkflowStates.Created;
            transporter.Name = Name;
            transporter.Description = Description;
            transporter.ForeignId = ForeignId;
            transporter.Address = Address;
            transporter.City = City;
            transporter.ZipCode = ZipCode;
            transporter.Phone = Phone;
            transporter.ContactPerson = ContactPerson;

            dbContext.Transporters.Add(transporter);
            dbContext.SaveChanges();

            dbContext.TransporterVersions.Add(MapVersions(dbContext, transporter));
            dbContext.SaveChanges();

        }

        public async Task Update(TrashInspectionPnDbContext dbContext)
        {
            Transporter transporter = dbContext.Transporters.FirstOrDefault(x => x.Id == Id);

            if (transporter == null)
            {
                throw new NullReferenceException($"Could not find transporter with ID: {Id}");
            }
            transporter.Name = Name;
            transporter.Description = Description;
            transporter.ForeignId = ForeignId;
            transporter.Address = Address;
            transporter.City = City;
            transporter.ZipCode = ZipCode;
            transporter.Phone = Phone;
            transporter.ContactPerson = ContactPerson;

            if (dbContext.ChangeTracker.HasChanges())
            {
                transporter.UpdatedAt = DateTime.Now;
                transporter.Version += 1;

                dbContext.TransporterVersions.Add(MapVersions(dbContext, transporter));
                dbContext.SaveChanges();
            }
        }

        public async Task Delete(TrashInspectionPnDbContext dbContext)
        {
            Transporter transporter = dbContext.Transporters.FirstOrDefault(x => x.Id == Id);

            if (transporter == null)
            {
                throw new NullReferenceException($"Could not find transporter with ID: {Id}");
            }

            transporter.WorkflowState = Constants.WorkflowStates.Removed;
            
            if (dbContext.ChangeTracker.HasChanges())
            {
                transporter.UpdatedAt = DateTime.Now;
                transporter.Version += 1;

                dbContext.TransporterVersions.Add(MapVersions(dbContext, transporter));
                dbContext.SaveChanges();
            }
        }




        public TransporterVersion MapVersions(TrashInspectionPnDbContext _dbContext, Transporter transporter)
        {
            TransporterVersion transporterVersion = new TransporterVersion();

            transporterVersion.Name = transporter.Name;
            transporterVersion.Description = transporter.Description;
            transporterVersion.ForeignId = transporter.ForeignId;
            transporterVersion.Address = transporter.Address;
            transporterVersion.City = transporter.City;
            transporterVersion.ZipCode = transporter.ZipCode;
            transporterVersion.Phone = transporter.Phone;
            transporterVersion.ContactPerson = transporter.ContactPerson;
            transporterVersion.Version = transporter.Version;
            transporterVersion.CreatedAt = transporter.CreatedAt;
            transporterVersion.UpdatedAt = transporter.UpdatedAt;
            transporterVersion.CreatedByUserId = transporter.CreatedByUserId;
            transporterVersion.UpdatedByUserId = transporter.UpdatedByUserId;
            transporterVersion.WorkflowState = transporter.WorkflowState;

            transporterVersion.TransporterId = transporter.Id;

            return transporterVersion;
        }
    }
}