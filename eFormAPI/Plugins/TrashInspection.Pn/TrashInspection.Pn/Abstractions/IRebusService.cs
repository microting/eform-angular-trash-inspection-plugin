using System.Threading.Tasks;
using Castle.Windsor;
using Rebus.Bus;

namespace TrashInspection.Pn.Abstractions
{
    public interface IRebusService
    {
        Task Start(string sdkConnectionString, string connectionString, int maxParallelism, int numberOfWorkers);
        IBus GetBus();
        WindsorContainer GetContainer();

    }
}