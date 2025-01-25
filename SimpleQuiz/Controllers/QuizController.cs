using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace SimpleQuiz.Controllers
{
    public class QuizController : Controller
    {
        private readonly DB _db;
        private readonly TokenService _tokenService;

        public QuizController(DB db, TokenService tokenService)
        {
            _db = db;
            _tokenService = tokenService;
        }
        public IActionResult Login()
        {
            return View();
        }
        public IActionResult Signup()
        {
            return View();
        }
        public IActionResult QuizOnline2()
        {
            ViewBag.Questions = _db.GetQuestions();
            ViewBag.Responses = _db.GetResponses();
            ViewBag.QuizInfo = _db.GetQuizInfo(1);
            return View();
        }
        public IActionResult QuizOnline(string token)
        {
            try
            {
                if (!_tokenService.ValidateToken(token, "QuizOnline"))
                {
                    return RedirectToAction("Login", "Quiz"); // یا صفحه خطا
                }
                ViewBag.Questions = _db.GetQuestions();
                ViewBag.Responses = _db.GetResponses();
                ViewBag.QuizInfo = _db.GetQuizInfo(1);
                return View();
            }
            catch (Exception)
            {
                throw;
            }
        }
        public IActionResult SendResultToServer([FromBody] dynamic result)
        {
            try
            {
                dynamic x = result;
                return Ok(x);
            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }
        }
        public IActionResult GenerateSecureLink(string action, string controller, string page)
        {
            var token = _tokenService.CreateToken(page);
            var secureLink = Url.Action(action, controller, new { token = token }, Request.Scheme);
            return Ok(secureLink);
        }
    }
}
