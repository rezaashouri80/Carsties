using Contracts;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationServices.Hubs;

namespace NotificationServices.Consumers
{
    public class BidPlacedConsumer : IConsumer<BidPlaced>
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public BidPlacedConsumer(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task Consume(ConsumeContext<BidPlaced> context)
        {
            Console.WriteLine("=> Bid Placed Notif");

            await _hubContext.Clients.All.SendAsync("BidPlaced", context);
        }
    }
}
