using System;
using System.Collections.Generic;
using System.Text;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

namespace TrashInspection.Pn.Infrastructure.Data
{
    public class CustomersConfigurationSeedData : IPluginConfigurationSeedData
    {
        public PluginConfigurationValue[] Data => new[]
        {
            new PluginConfigurationValue()
            {
                Name = "TestSettings:Id",
                Value = "10"
            },
            new PluginConfigurationValue()
            {
                Name = "TestSettings:Name",
                Value = "Trtrtrt"
            },
        };
    }
}
