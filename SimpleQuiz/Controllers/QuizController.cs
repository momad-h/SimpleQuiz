using Microsoft.AspNetCore.Mvc;

namespace SimpleQuiz.Controllers
{
    public class QuizController : Controller
    {
        public IActionResult Login()
        {
            return View();
        }
        public IActionResult Signup()
        {
            return View();
        }
        public IActionResult QuizOnline() 
        { 
            return View();
        }
    }
}
