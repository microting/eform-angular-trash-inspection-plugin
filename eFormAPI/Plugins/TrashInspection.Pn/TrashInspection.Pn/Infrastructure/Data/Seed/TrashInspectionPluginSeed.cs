using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using TrashInspection.Pn.Infrastructure.Data.Seed.Data;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using System;
using System.Linq;
using eFormShared;

namespace TrashInspection.Pn.Infrastructure.Data.Seed
{
    public class TrashInspectionPluginSeed
    {
        public static void SeedData(TrashInspectionPnDbContext dbContext)
        {
            var seedData = new TrashInspectionConfigurationSeedData();
            var configurationList = seedData.Data;
            foreach (var configurationItem in configurationList)
            {
                if (!dbContext.PluginConfigurationValues.Any(x=>x.Name == configurationItem.Name))
                {
                    var newConfigValue = new PluginConfigurationValue()
                    {
                        Name = configurationItem.Name,
                        Value = configurationItem.Value,
                        CreatedAt = DateTime.UtcNow,
                        Version = 1,
                        WorkflowState = Constants.WorkflowStates.Created,
                        CreatedByUserId = 1
                    };
                    dbContext.PluginConfigurationValues.Add(newConfigValue);
                    dbContext.SaveChanges();
                }
            }
        }
    }
}