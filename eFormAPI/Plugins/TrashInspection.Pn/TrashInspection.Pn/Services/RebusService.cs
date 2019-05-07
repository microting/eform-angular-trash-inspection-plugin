using Castle.MicroKernel.Registration;
using Castle.Windsor;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using Rebus.Bus;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Installers;
using eFormCore;
using Microsoft.EntityFrameworkCore;

namespace TrashInspection.Pn.Services
{
    public class RebusService : IRebusService
    {
        private IBus _bus;
        private IWindsorContainer _container;
        private string _connectionString;
        private readonly IEFormCoreService _coreHelper;

        public RebusService(IEFormCoreService coreHelper)
        {            
            //_dbContext = dbContext;
            _coreHelper = coreHelper;
        }

        public void Start(string connectionString)
        {
            _connectionString = connectionString;   
            _container = new WindsorContainer();
            _container.Install(
                new RebusHandlerInstaller()
                , new RebusInstaller(connectionString, 1, 1)
            );
            
            Core _core = _coreHelper.GetCore();
            _container.Register(Component.For<Core>().Instance(_core));
            _container.Register(Component.For<TrashInspectionPnDbContext>().Instance(GetContext()));
            _bus = _container.Resolve<IBus>();
        }

        public IBus GetBus()
        {
            return _bus;
        }
        private TrashInspectionPnDbContext GetContext()
        {
            TrashInspectionPnContextFactory contextFactory = new TrashInspectionPnContextFactory();
            return contextFactory.CreateDbContext(new[] {_connectionString});

        }
    }
}