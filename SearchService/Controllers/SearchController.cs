using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;
using SearchService.Model;
using SearchService.RequestHelpers;

namespace SearchService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<Item>>> SearchItems([FromQuery]SearchParams searchParams)
        {
            var query = DB.PagedSearch<Item,Item>();

            query.Sort(i => i.Ascending(a => a.Make));

            if (!string.IsNullOrWhiteSpace(searchParams.SearchTerm))
            {
                query.Match(Search.Full,searchParams.SearchTerm).SortByTextScore();
            }

            query = searchParams.OrderBy switch
            {
                "make" => query.Sort(a => a.Ascending(a => a.Make)),
                "new" => query.Sort(a => a.Descending(a => a.CreatedAt)),
                _ => query.Sort(a => a.Ascending(a => a.AuctionEnd))
            };

            query = searchParams.FilterBy switch
            {
                "finished" => query.Match(a => a.AuctionEnd < DateTime.UtcNow),
                "endingSoon" => query.Match(a => a.AuctionEnd < DateTime.UtcNow.AddHours(6)
                && a.AuctionEnd > DateTime.UtcNow),
                _ => query.Match(a => a.AuctionEnd > DateTime.UtcNow)
            };

            if (!string.IsNullOrWhiteSpace(searchParams.Seller))
            {
                query.Match(a => a.Seller.Equals(searchParams.Seller));
            }

            if (!string.IsNullOrWhiteSpace(searchParams.Winner))
            {
                query.Match(a => a.Winner.Equals(searchParams.Winner));
            }

            query.PageNumber(searchParams.PageNumber);
            query.PageSize(searchParams.PageSize);

            var result = await query.ExecuteAsync();

            return Ok(new
            {
                results = result.Results,
                pageCount = result.PageCount,
                totalCount = result.TotalCount
            });
        }
    }
}
