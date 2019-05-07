/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 microting

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

using System;
using System.Collections.Generic;
using System.Reflection;
using Castle.Windsor;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microting.eFormApi.BasePn;
using Microting.eFormApi.BasePn.Infrastructure.Database.Extensions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Settings;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using Rebus.Bus;
using TrashInspection.Pn.Infrastructure.Data.Seed;
using TrashInspection.Pn.Infrastructure.Data.Seed.Data;
using TrashInspection.Pn.Infrastructure.Models;
using TrashInspection.Pn.Installers;

namespace TrashInspection.Pn
{
    public class EformTrashInspectionPlugin : IEformPlugin
    {
        public string Name => "Microting Trash Inspection Plugin";
        public string PluginId => "eform-angular-trashinspection-plugin";
        public string PluginPath => PluginAssembly().Location;
        private string _connectionString;

        public Assembly PluginAssembly()
        {
            return typeof(EformTrashInspectionPlugin).GetTypeInfo().Assembly;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddTransient<IFractionService, FractionService>();
            services.AddTransient<ISegmentService, SegmentService>();
            services.AddTransient<IInstallationService, InstallationService>();
            services.AddSingleton<ITrashInspectionLocalizationService, TrashInspectionLocalizationService>();
            services.AddTransient<ITrashInspectionService, TrashInspectionService>();
            services.AddTransient<ITrashInspectionPnSettingsService, TrashInspectionPnSettingsService>();
            services.AddTransient<ITransporterService, TransporterService>();
            services.AddTransient<IProducerService, ProducerService>();
            services.AddSingleton<IRebusService, RebusService>();
        }

        public void AddPluginConfig(IConfigurationBuilder builder, string connectionString)
        {
            var seedData = new TrashInspectionConfigurationSeedData();
            var contextFactory = new TrashInspectionPnContextFactory();
            builder.AddPluginConfiguration(
                connectionString, 
                seedData, 
                contextFactory);
        }

        public void ConfigureDbContext(IServiceCollection services, string connectionString)
        {
            _connectionString = connectionString;
            if (connectionString.ToLower().Contains("convert zero datetime"))
            {
                services.AddDbContext<TrashInspectionPnDbContext>(o => o.UseMySql(connectionString,
                    b => b.MigrationsAssembly(PluginAssembly().FullName)));
            }
            else
            {
                services.AddDbContext<TrashInspectionPnDbContext>(o => o.UseSqlServer(connectionString,
                    b => b.MigrationsAssembly(PluginAssembly().FullName)));
            }

            TrashInspectionPnContextFactory contextFactory = new TrashInspectionPnContextFactory();
            var context = contextFactory.CreateDbContext(new[] {connectionString});
            context.Database.Migrate();

            // Seed database
            SeedDatabase(connectionString);
        }

        public void Configure(IApplicationBuilder appBuilder)
        {
            var serviceProvider = appBuilder.ApplicationServices;
            IRebusService rebusService = serviceProvider.GetService<IRebusService>();
            rebusService.Start(_connectionString);

        }

        public MenuModel HeaderMenu(IServiceProvider serviceProvider)
        {
            var localizationService = serviceProvider
                .GetService<ITrashInspectionLocalizationService>();

            var result = new MenuModel();
            result.LeftMenu.Add(new MenuItemModel()
            {
                Name = localizationService.GetString("TrashInspection"),
                E2EId = "",
                Link = "",
                MenuItems = new List<MenuItemModel>()
                {
                    new MenuItemModel()
                    {
                        Name = localizationService.GetString("TrashInspections"),
                        E2EId = "trash-inspection-pn-trash-inspection",
                        Link = "/plugins/trash-inspection-pn/trash-inspections",
                        Position = 0,
                    },
                    new MenuItemModel()
                    {
                        Name = localizationService.GetString("Installations"),
                        E2EId = "trash-inspection-pn-installations",
                        Link = "/plugins/trash-inspection-pn/installations",
                        Position = 1,
                    },
                    new MenuItemModel()
                    {
                        Name = localizationService.GetString("Fractions"),
                        E2EId = "trash-inspection-pn-fractions",
                        Link = "/plugins/trash-inspection-pn/fractions",
                        Position = 2,
                    },
                    new MenuItemModel()
                    {
                        Name = localizationService.GetString("Settings"),
                        E2EId = "trash-inspection-pn-settings",
                        Link = "/plugins/trash-inspection-pn/settings",
                        Position = 3,
                    },
                    new MenuItemModel()
                    {
                        Name = localizationService.GetString("Segments"),
                        E2EId = "trash-inspection-pn-segments",
                        Link = "/plugins/trash-inspection-pn/segments",
                        Position = 3,
                    },
                    new MenuItemModel()
                    {
                        Name = localizationService.GetString("Producers"),
                        E2EId = "trash-inspection-pn-producers",
                        Link = "/plugins/trash-inspection-pn/producers",
                        Position = 4,
                    },
                    new MenuItemModel()
                    {
                        Name = localizationService.GetString("Transporters"),
                        E2EId = "trash-inspection-pn-transporters",
                        Link = "/plugins/trash-inspection-pn/transporters",
                        Position = 5,
                    }
                }
            });
            return result;
        }

        public void SeedDatabase(string connectionString)
        {
            var contextFactory = new TrashInspectionPnContextFactory();
            using (var context = contextFactory.CreateDbContext(new []{connectionString}))
            {
                TrashInspectionPluginSeed.SeedData(context);
            }
        }

        public void ConfigureOptionsServices(IServiceCollection services, IConfiguration configuration)
        {
            services.ConfigurePluginDbOptions<TrashInspectionBaseSettings>(
                configuration.GetSection("TrashInspectionBaseSettings"));
       }
    }
}