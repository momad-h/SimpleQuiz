using Microsoft.AspNetCore.Mvc;
using SimpleQuiz.Models;
using System.Diagnostics;

namespace SimpleQuiz.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly TokenService _tokenService;
        private readonly DB _db;

        public HomeController(ILogger<HomeController> logger, TokenService tokenService, DB db)
        {
            _logger = logger;
            _tokenService = tokenService;
            _db = db;
        }

        public IActionResult Index(string token)
        {
            var posts=_db.GetBlogPosts();
            return View(posts);
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
