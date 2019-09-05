using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OtomatikMuhendis.Cnc.Web.Models;

namespace OtomatikMuhendis.Cnc.Web.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> PredictImageContentsAsync([FromBody] AssertViewModel model)
        {
            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Prediction-key", AppSettings.CustomVisionPredictionKey);

            byte[] imageData = Convert.FromBase64String(model.ImageData);

            HttpResponseMessage response;
            using (var content = new ByteArrayContent(imageData))
            {
                content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                response = await client.PostAsync(AppSettings.CustomVisionPredictionUrl, content);
            }

            var resultJson = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<PredictionResult>(resultJson);

            var mostProbable = result.Predictions.OrderByDescending(p => p.Probability).FirstOrDefault();

            return Ok(mostProbable);
        }


        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
