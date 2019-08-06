using Rebus.Bus;

namespace TrashInspection.Pn.Abstractions
{
    public interface IRebusService
    {
        void Start(string connectionString, int maxParallelism, int numberOfWorkers);
        IBus GetBus();

    }
}