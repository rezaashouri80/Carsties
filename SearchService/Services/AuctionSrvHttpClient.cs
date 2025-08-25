using MongoDB.Entities;
using SearchService.Model;

namespace SearchService.Services
{
    public class AuctionSrvHttpClient
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public AuctionSrvHttpClient(HttpClient httpClient, IConfiguration configuration) 
        {
            _httpClient=httpClient;
            _configuration=configuration;
        }

        public async Task<List<Item>> GetItemsForSearchDb()
        {
            var lastUpdated =await DB.Find<Item, string>()
                .Sort(a => a.Descending(a => a.UpdatedAt))
                .Project(a=>a.UpdatedAt.ToString())
                .ExecuteFirstAsync();

            return await _httpClient.GetFromJsonAsync<List<Item>>
                (_configuration["AuctionServiceUrl"] + "/api/auctions?date="+lastUpdated);
        }
    }
}
