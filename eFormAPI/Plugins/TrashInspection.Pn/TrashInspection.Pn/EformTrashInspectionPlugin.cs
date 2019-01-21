using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Data;
using TrashInspection.Pn.Infrastructure.Data.Entities;
using TrashInspection.Pn.Infrastructure.Data.Factories;
using TrashInspection.Pn.Infrastructure.Extensions;
using TrashInspection.Pn.Infrastructure.Models;
using TrashInspection.Pn.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microting.eFormApi.BasePn;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;

namespace TrashInspection.Pn
{
    public class EformTrashInspectionPlugin : IEformPlugin
    {
        public string Name => "Microting Trash Inspection Plugin";
        public string PluginId => "EFormTrashInspectionPn";
        public string PluginPath => PluginAssembly().Location;

        public Assembly PluginAssembly()
        {
            return typeof(EformTrashInspectionPlugin).GetTypeInfo().Assembly;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddTransient<IInstallationService, InstallationService>();
            services.AddSingleton<ITrashInspectionLocalizationService, TrashInspectionLocalizationService>();
            services.AddTransient<ITrashInspectionService, TrashInspectionService>();
            services.AddTransient<ITrashInspectionPnSettingsService, TrashInspectionPnSettingsService>();
        }

        public void ConfigureDbContext(IServiceCollection services, string connectionString)
        {
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
            var context = contextFactory.CreateDbContext(new[] { connectionString });
            context.Database.Migrate();

            // Seed database
            SeedDatabase(connectionString);
        }

        public void Configure(IApplicationBuilder appBuilder)
        {
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
                        Name =  localizationService.GetString("TrashInspections"),
                        E2EId = "trash-inspection-pn-trash-inspection",
                        Link = "/plugins/trash-inspection-pn/trash-inspections",
                        Position = 0,
                    },
                    new MenuItemModel()
                    {
                        Name =  localizationService.GetString("Installations"),
                        E2EId = "trash-inspection-pn-installations",
                        Link = "/plugins/trash-inspection-pn/installations",
                        Position = 1,
                    },
                    new MenuItemModel()
                    {
                        Name = localizationService.GetString("Settings"),
                        E2EId = "trash-inspection-pn-settings",
                        Link = "/plugins/trash-inspection-pn/settings",
                        Position = 2,
                    }
                }
            });
            return result;
        }

        public void SeedDatabase(string connectionString)
        {

        }
    }
}
