
using BiddingService.Models;
using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace BiddingService.Services
{
    public class CheckAuctionFinished : BackgroundService
    {
        private readonly ILogger<CheckAuctionFinished> _logger;
        private readonly IServiceProvider _serviceProvider;

        public CheckAuctionFinished(ILogger<CheckAuctionFinished> logger,IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Starting check for finished auctions");

            stoppingToken.Register(() =>
            {
                _logger.LogInformation("=>> Auction check is stopping");
            });

            while (stoppingToken.IsCancellationRequested)
            {
                await CheckAuctions(stoppingToken);

                await Task.Delay(5000,stoppingToken);
            }

        }

        private async Task CheckAuctions(CancellationToken stoppingToken)
        {
            var finishedAuctions = await DB.Find<Auction>().Match(x=> x.AuctionEnd<=DateTime.UtcNow)
                .Match(x=>!x.Finished).ExecuteAsync(stoppingToken);

            _logger.LogInformation($"==> Found {finishedAuctions.Count} finished auctions");


            if (finishedAuctions.Count == 0) return;


            using var scope = _serviceProvider.CreateScope();

            var publisher = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>();

            foreach(var item in finishedAuctions)
            {
                item.Finished = true;
                await item.SaveAsync(cancellation: stoppingToken);

                var winningBid = await DB.Find<Bid>()
                    .Match(x=>x.AuctionId.Equals(item.ID))
                    .Match(x=>x.BidStatus == BidStatus.Accepted)
                    .Sort(b=>b.Descending(y=>y.Amount)).ExecuteFirstAsync(stoppingToken);

                await publisher.Publish<AuctionFinished>(new AuctionFinished()
                {
                    Amount = winningBid?.Amount,
                    Seller = item.Seller,
                    Winner = winningBid?.Bidder,
                    AuctionId = item.ID,
                    ItemSold = winningBid != null
                },stoppingToken);
                
            }
        }
    }
}
