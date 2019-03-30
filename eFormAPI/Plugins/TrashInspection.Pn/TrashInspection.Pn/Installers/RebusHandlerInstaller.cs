using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Rebus.Handlers;
using TrashInspection.Pn.Handlers;
using TrashInspection.Pn.Messages;

namespace TrashInspection.Pn.Installers
{
    public class RebusHandlerInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(Component.For<IHandleMessages<TrashInspectionReceived>>().ImplementedBy<TrashInspectionReceivedHandler>().LifestyleTransient());            
        }
    }
}