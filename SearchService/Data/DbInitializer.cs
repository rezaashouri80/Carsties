using MongoDB.Driver;
using MongoDB.Entities;
using SearchService.Model;
using SearchService.Services;
using System.Text.Json;

namespace SearchService.Data
{
    public class DbInitializer
    {
        public static async Task InitDb(WebApplication application)
        {
            await DB.InitAsync("SearchDb", MongoClientSettings.FromConnectionString(
                application.Configuration.GetConnectionString("MongoDbConnection")));

            await DB.Index<Item>()
                .Key(x => x.Make, KeyType.Text)
                .Key(x => x.Model, KeyType.Text)
                .Key(x => x.Color, KeyType.Text)
                .CreateAsync();

                using var scope = application.Services.CreateScope();

                var httpClinet = scope.ServiceProvider.GetRequiredService<AuctionSrvHttpClient>();

                var items =await httpClinet.GetItemsForSearchDb();

                Console.WriteLine(items.Count + " returned from auction service");

                if (items.Count > 0) await DB.SaveAsync(items);
                

        }
    }
}
