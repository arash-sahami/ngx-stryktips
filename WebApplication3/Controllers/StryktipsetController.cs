using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace WebApplication3.Controllers
{
   [ApiController]
   [Route("[controller]")]
   public class StryktipsetController : ControllerBase
   {
      private readonly ILogger<StryktipsetController> _logger;

      public StryktipsetController(ILogger<StryktipsetController> logger)
      {
         _logger = logger;
      }

      [HttpGet("get-draw")]
      public async Task<ActionResult> GetDraws()
      {
         try
         {
            using var client = new HttpClient();
            var draws = await client.GetStringAsync("https://api.www.svenskaspel.se/draw/stryktipset/draws");
            var results = SaveDraws(draws);
            return new ContentResult()
            {
               Content = JsonConvert.SerializeObject(results, new JsonSerializerSettings
               {
                  ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() }
               })};
         }
         catch (Exception ex)
         {
            return new ContentResult() { Content = ex.Message };
         }
      }

      private ResultModel SaveDraws(string draws)
      {
         var resultModel = new ResultModel();
 
         if (EnsureCacheDirectory(out string cacheDir))
         {
            System.IO.File.WriteAllText(Path.Combine(cacheDir, "original"), draws);
            resultModel.Original = draws;
         }
         else
         {
            System.IO.File.WriteAllText(Path.Combine(cacheDir, "latest"), draws);
            resultModel.Original = System.IO.File.ReadAllText(Path.Combine(cacheDir, "original"));
            resultModel.Latest = draws;
         }

         return resultModel;
      }

      public bool EnsureCacheDirectory(out string cacheDirectory)
      {
         var isNew = false;

         var currentWeek = GetIso8601WeekOfYear(DateTime.Now);
         if (Directory.Exists(@"results") == false)
         {
            Directory.CreateDirectory(@"results");
            isNew = true;
         }

         if (Directory.Exists($"results/{currentWeek}") == false)
         {
            cacheDirectory = Directory.CreateDirectory($"results/{currentWeek}").FullName;
            isNew = true;
         }
         else
         {
            cacheDirectory = Path.GetFullPath($"results/{currentWeek}");
         }

         return isNew;
      }

      // This presumes that weeks start with Monday.
      // Week 1 is the 1st week of the year with a Thursday in it.
      private static int GetIso8601WeekOfYear(DateTime time)
      {
         // Seriously cheat.  If its Monday, Tuesday or Wednesday, then it'll 
         // be the same week# as whatever Thursday, Friday or Saturday are,
         // and we always get those right
         DayOfWeek day = CultureInfo.InvariantCulture.Calendar.GetDayOfWeek(time);
         if (day >= DayOfWeek.Monday && day <= DayOfWeek.Wednesday)
         {
            time = time.AddDays(3);
         }

         // Return the week of our adjusted day
         return CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(time, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
      }
   }

   public class ResultModel
   {
      public string Original { get; set; }
      public string Latest { get; set; }
   }
}
