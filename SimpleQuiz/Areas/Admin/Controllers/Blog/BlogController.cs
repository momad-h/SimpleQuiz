using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SimpleQuiz.Areas.Admin.Controllers.Blog
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class BlogController : Controller
    {
        private readonly DB _db;
        public BlogController(DB dB)
        {
            _db = dB;
        }
        public IActionResult Blog_Post_Add()
        {
            var posts = _db.GetBlogPosts();
            return View(posts);
        }
        
    }
}
