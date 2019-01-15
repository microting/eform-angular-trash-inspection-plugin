using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace TrashInspection.Pn.Infrastructure.Data.Factories
{
    public class TrashInspectionPnContextFactory : IDesignTimeDbContextFactory<TrashInspectionPnDbContext>
    {
        public TrashInspectionPnDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<TrashInspectionPnDbContext>();
            if (args.Any())
            {
                if (args.FirstOrDefault().ToLower().Contains("convert zero datetime"))
                {
                    optionsBuilder.UseMySql(args.FirstOrDefault());
                }
                else
                {
                    optionsBuilder.UseSqlServer(args.FirstOrDefault());
                }
            }
            else
            {
                throw new ArgumentNullException("Connection string not present");
            }
//            optionsBuilder.UseSqlServer(@"data source=(LocalDb)\SharedInstance;Initial catalog=machine-area-pn-tests;Integrated Security=True");
            optionsBuilder.UseLazyLoadingProxies(true);
            return new TrashInspectionPnDbContext(optionsBuilder.Options);
        }
    }
}
