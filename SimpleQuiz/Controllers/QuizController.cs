using Microsoft.AspNetCore.Mvc;

namespace SimpleQuiz.Controllers
{
    public class QuizController : Controller
    {
        private readonly DB _db;
        public QuizController(DB db)
        {
            _db = db;
        }
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
            try
            {
                ViewBag.Questions = _db.GetQuestions();
                ViewBag.Responses = _db.GetResponses();
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
    }
}
