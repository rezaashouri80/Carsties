using AuctionService.Data;
using AuctionService.protos;
using Grpc.Core;

namespace AuctionService.Services
{
    public class GrpcAuctionService : GrpcAuction.GrpcAuctionBase
    {
        private readonly AuctionDbContext _dbContext;

        public GrpcAuctionService(AuctionDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public override async Task<GrpcAuctionResponse> GetAuction(GetAuctionRequest request, ServerCallContext context)
        {
            Console.WriteLine("==> Grpc request for auction");

            var auction = await _dbContext.Auctions.FindAsync(Guid.Parse(request.Id));

            if (auction == null)
                throw new RpcException(new Status(StatusCode.NotFound,"Not found"));

            var response = new GrpcAuctionResponse()
            {
                Auction = new GrpcAuctionModel()
                {
                    Id = auction.Id.ToString(),
                    AuctionEnd = auction.AuctionEnd.ToString(),
                    ReservePrice = auction.ReservePrice,
                    Seller = auction.Seller
                }
            };

            return response;
        }
    }
}
