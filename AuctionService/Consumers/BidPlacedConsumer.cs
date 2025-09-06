﻿using AuctionService.Data;
using Contracts;
using MassTransit;

namespace AuctionService.Consumers
{
    public class BidPlacedConsumer : IConsumer<BidPlaced>
    {
        private readonly AuctionDbContext _context;

        public BidPlacedConsumer(AuctionDbContext context)
        {
            _context = context;
        }

        public async Task Consume(ConsumeContext<BidPlaced> context)
        {
            Console.WriteLine(" ---> Consuming Bid Placed");

            var auction = await _context.Auctions.FindAsync(context.Message.AuctionId);

            if(auction.CurrentHighBid == null
                || context.Message.BidStatus.Contains("Accepted")
                && auction.CurrentHighBid < context.Message.Amount)
            {

                auction.CurrentHighBid = context.Message.Amount;

                await _context.SaveChangesAsync();
            }
        }
    }
}
