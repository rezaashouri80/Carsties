using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Model;

namespace SearchService.Consumer
{
    public class AuctionUpdatedConsumer : IConsumer<AuctionUpdated>
    {
        private readonly IMapper _mapper;

        public AuctionUpdatedConsumer(IMapper mapper)
        {
            _mapper = mapper;
        }

        public async Task Consume(ConsumeContext<AuctionUpdated> context)
        {
            Console.WriteLine("Consume Update Auction with Id = " + context.Message.Id);

            var result = await DB.Update<Item>()
            .Match(a => a.ID == context.Message.Id)
            .Modify(a => a.Make, context.Message.Make)
            .Modify(a => a.Model, context.Message.Model)
            .Modify(a => a.Year, context.Message.Year)
            .Modify(a => a.Mileage, context.Message.Mileage)
            .ExecuteAsync();

            if (!result.IsAcknowledged)
                throw new MessageException(typeof(AuctionDeleted), "Problem Updating Auction");

    }
    }
}
