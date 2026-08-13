using System.Threading;
using System.Threading.Tasks;
using TrashInspection.Pn.Infrastructure.Models.Nav;

namespace TrashInspection.Pn.Abstractions
{
    /// <summary>
    /// Posts a weighing to the NAV MicrotingWS endpoint. The sender performs no persistence: it
    /// is a pure function from inputs to result, so the caller owns entity mutation.
    /// </summary>
    public interface INavCallbackSender
    {
        Task<NavCallResult> SendAsync(NavCallbackSettings settings, string weighingNumber, bool approved,
            CancellationToken cancellationToken = default);
    }
}
