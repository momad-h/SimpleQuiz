using Microsoft.AspNetCore.Mvc;
using SimpleQuiz.Models;
using System.Diagnostics;

namespace SimpleQuiz.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly TokenService _tokenService;

        public HomeController(ILogger<HomeController> logger, TokenService tokenService)
        {
            _logger = logger;
            _tokenService = tokenService;
        }

        public IActionResult Index(string token)
        {
            if (!_tokenService.ValidateToken(token, "Index"))
            {
                return RedirectToAction("Login", "Quiz"); // یا صفحه خطا
            }
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
