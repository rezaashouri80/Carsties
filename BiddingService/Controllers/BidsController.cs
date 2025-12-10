using AutoMapper;
using BiddingService.DTOs;
using BiddingService.Models;
using BiddingService.Services;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace BiddingService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BidsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IPublishEndpoint _publishEndpoint;
        private readonly GrpcAuctionClient _grpcAuction;

        public BidsController(IMapper mapper,IPublishEndpoint publishEndpoint,GrpcAuctionClient grpcAuction)
        {
            _mapper = mapper;
            _publishEndpoint = publishEndpoint;
            _grpcAuction = grpcAuction;
        }


        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BidDto>> PlaceBid(string auctionId, int amount)
        {
            var auction = await DB.Find<Auction>().OneAsync(auctionId);

            
            if (auction == null)
            {
                auction = await _grpcAuction.GetAuctionAsync(auctionId);

                Console.WriteLine(auction.ID);

                if (auction == null)
                    return BadRequest("Can nat accept bid for this auction");
               
            }

            if (auction.Seller == User.Identity.Name)
            {
                return BadRequest("You cant place bid for your car");
            }

            var bid = new Bid()
            {
                Amount = amount,
                AuctionId = auctionId,
                Bidder = User.Identity.Name
            };

            if (auction.AuctionEnd < DateTime.UtcNow)
            {
                bid.BidStatus = BidStatus.Finished;
            }
            else
            {
                var highBid = await DB.Find<Bid>().Match(x => x.AuctionId.Equals(auctionId))
                    .Sort(x => x.Descending(y => y.Amount)).ExecuteFirstAsync();

                if (highBid != null && amount > highBid.Amount || highBid == null)
                {
                    bid.BidStatus = amount > auction.ReservePrice
                        ? BidStatus.Accepted : BidStatus.AcceptedBelowReserveOrice;
                }

                if (highBid != null && amount <= highBid.Amount)
                {
                    bid.BidStatus = BidStatus.TooLow;
                }
            }

            await DB.SaveAsync(bid);

            await _publishEndpoint.Publish<BidPlaced>(_mapper.Map<BidPlaced>(bid));

            return Ok(_mapper.Map<BidDto>(bid));

        }

        [HttpGet("{auctionId}")]
        public async Task<ActionResult<List<BidDto>>> GetBidsForAuction(string auctionId)
        {
            var bids = await DB.Find<Bid>()
                .Match(x => x.AuctionId.Equals(auctionId)).Sort(b => b.Descending(y => y.BidTime))
                .ExecuteAsync();

            return _mapper.Map<List<BidDto>>(bids);
                
        }

    }
}
