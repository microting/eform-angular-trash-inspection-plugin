using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

namespace TrashInspection.Pn.Infrastructure.Data.Seed.Data
{
    public class TrashInspectionConfigurationSeedData : IPluginConfigurationSeedData
    {
        public PluginConfigurationValue[] Data => new[]
        {
            new PluginConfigurationValue()
            {
                Name = "TrashInspectionBaseSettings:LogLevel",
                Value = "4"
            },
            new PluginConfigurationValue()
            {
                Name = "TrashInspectionBaseSettings:LogLimit",
                Value = "25000"
            },
            new PluginConfigurationValue()
            {
                Name = "TrashInspectionBaseSettings:SdkConnectionString",
                Value = "..."
            },
            new PluginConfigurationValue()
            {
                Name = "TrashInspectionBaseSettings:MaxParallelism",
                Value = "1"
            },
            new PluginConfigurationValue()
            {
                Name = "TrashInspectionBaseSettings:NumberOfWorkers",
                Value = "1"
            },
            new PluginConfigurationValue()
            {
                Name = "TrashInspectionBaseSettings:Token",
                Value = "..."
            },
            new PluginConfigurationValue()
            {
                Name = "TrashInspectionBaseSettings:CallBackUrl",
                Value = "..."
            },
            new PluginConfigurationValue()
            {
                Name = "TrashInspectionBaseSettings:CallBackCredentialDomain",
                Value = "..."
            },
            new PluginConfigurationValue()
            {
                Name = "TrashInspectionBaseSettings:CallbackCredentialUserName",
                Value = "..."
            },
            new PluginConfigurationValue()
            {
                Name = "TrashInspectionBaseSettings:CallbackCredentialPassword",
                Value = "..."
            },
            new PluginConfigurationValue()
            {
                Name = "TrashInspectionBaseSettings:CallbackCredentialAuthType",
                Value = "..."
            },
            new PluginConfigurationValue()
            {
                Name = "TrashInspectionBaseSettings:ExtendedInspectioneFormId",
                Value = "2"
            },
        };
    }
}