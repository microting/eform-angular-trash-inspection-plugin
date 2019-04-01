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
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class ProducerModel
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
            Producer producer = new Producer();
            producer.CreatedAt = DateTime.Now;
            producer.UpdatedAt = DateTime.Now;
            producer.CreatedByUserId = CreatedByUserId;
            producer.UpdatedByUserId = UpdatedByUserId;
            producer.Version = 1;
            producer.WorkflowState = Constants.WorkflowStates.Created;
            producer.Name = Name;
            producer.Description = Description;
            producer.ForeignId = ForeignId;
            producer.Address = Address;
            producer.City = City;
            producer.ZipCode = ZipCode;
            producer.Phone = Phone;
            producer.ContactPerson = ContactPerson;

            dbContext.Producers.Add(producer);
            dbContext.SaveChanges();

            dbContext.ProducerVersions.Add(MapVersions(dbContext, producer));
            dbContext.SaveChanges();

        }

        public async Task Update(TrashInspectionPnDbContext dbContext)
        {
            Producer producer = dbContext.Producers.FirstOrDefault(x => x.Id == Id);

            if (producer == null)
            {
                throw  new NullReferenceException($"Could not find producer with ID: {Id}");
            }
            producer.Name = Name;
            producer.Description = Description;
            producer.ForeignId = ForeignId;
            producer.Address = Address;
            producer.City = City;
            producer.ZipCode = ZipCode;
            producer.Phone = Phone;
            producer.ContactPerson = ContactPerson;

            if (dbContext.ChangeTracker.HasChanges())
            {
                producer.UpdatedAt = DateTime.Now;
                producer.UpdatedByUserId = UpdatedByUserId;
                producer.Version += 1;

                dbContext.ProducerVersions.Add(MapVersions(dbContext, producer));
                dbContext.SaveChanges();
            }
            
        }

        public async Task Delete(TrashInspectionPnDbContext dbContext)
        {
            Producer producer = dbContext.Producers.FirstOrDefault(x => x.Id == Id);

            if (producer == null)
            {
                throw  new NullReferenceException($"Could not find producer with ID: {Id}");
            }

            producer.WorkflowState = Constants.WorkflowStates.Removed;
            
            if (dbContext.ChangeTracker.HasChanges())
            {
                producer.UpdatedAt = DateTime.Now;
                producer.UpdatedByUserId = UpdatedByUserId;
                producer.Version += 1;

                dbContext.ProducerVersions.Add(MapVersions(dbContext, producer));
                dbContext.SaveChanges();
            }
        }

        public ProducerVersion MapVersions(TrashInspectionPnDbContext _dbContext, Producer producer)
        {
            ProducerVersion producerVersion = new ProducerVersion();

            producerVersion.Name = producer.Name;
            producerVersion.Description = producer.Description;
            producerVersion.ForeignId = producer.ForeignId;
            producerVersion.Address = producer.Address;
            producerVersion.City = producer.City;
            producerVersion.ZipCode = producer.ZipCode;
            producerVersion.Phone = producer.Phone;
            producerVersion.ContactPerson = producer.ContactPerson;
            producerVersion.Version = producer.Version;
            producerVersion.CreatedAt = producer.CreatedAt;
            producerVersion.UpdatedAt = producer.UpdatedAt;
            producerVersion.CreatedByUserId = producer.CreatedByUserId;
            producerVersion.UpdatedByUserId = producer.UpdatedByUserId;
            producerVersion.WorkflowState = producer.WorkflowState;

            producerVersion.ProducerId = producer.Id;

            return producerVersion;
        }
    }
}