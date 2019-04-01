using Rebus.Bus;

namespace TrashInspection.Pn.Abstractions
{
    public interface IRebusService
    {
        void Start(string connectionString);
        IBus GetBus();

    }
}