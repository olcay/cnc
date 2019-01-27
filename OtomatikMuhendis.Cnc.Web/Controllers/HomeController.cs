using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using OtomatikMuhendis.Cnc.Client;
using OtomatikMuhendis.Cnc.Web.Models;

namespace OtomatikMuhendis.Cnc.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ICncClient _cncClient;

        public HomeController(ICncClient cncClient)
        {
            _cncClient = cncClient;
        }

        public IActionResult UnlockMotors()
        {
            _cncClient.UnlockMotors();

            return View("Index");
        }

        public IActionResult PenUp()
        {
            _cncClient.PenUp();

            return View("Index");
        }

        public IActionResult PenDown()
        {
            _cncClient.PenDown();

            return View("Index");
        }
        
        public IActionResult Index([FromQuery] int x = 0, [FromQuery] int y = 0)
        {
            _cncClient.GoTo(x, y);

            return View();
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
