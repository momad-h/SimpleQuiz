using Microsoft.AspNetCore.Mvc;

namespace SimpleQuiz.Controllers
{
    public class QuizManagmentController : Controller
    {
        private readonly DB _db;

        public QuizManagmentController(DB db)
        {
            _db = db;
        }
        public async Task<IActionResult> QuizManager()
        {
            var quizList = await _db.AsyncGetQuizInfo();
            return View(quizList);
        }
    }
}
