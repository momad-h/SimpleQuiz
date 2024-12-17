using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SimpleQuiz.Models;
using Newtonsoft.Json;
using System.Reflection;
namespace SimpleQuiz.Controllers
{
    [Route("qApi/[controller]")]
    [ApiController]
    public class QuizApiController : ControllerBase
    {
        private readonly DB _db;
        public QuizApiController(DB db)
        {
            _db = db;
        }
        [HttpGet("GetQuestions")]
        public IActionResult GetQuestions()
        {
            try
            {
                return Ok(_db.GetQuestions());
            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }
        }
        [HttpPost("SendResultToServer")]
        public IActionResult SendResultToServer([FromBody] QuizSubmissionModel model)
        {
            try
            {
                if (model?.Answers == null || model.Answers.Count == 0)
                {
                    return BadRequest(new { Message = "پاسخی ارسال نشده است." });
                }

                // بررسی پاسخ‌ها
                var result = model.Answers.Select(answer => new {
                    QuestionId = answer.QuestionId,
                    QuestionText = answer.QuestionText,
                    Answer = answer.Answer,
                    IsCorrect = _db.CheckAnswer(answer.QuestionId, answer.Answer) // بررسی درست یا غلط بودن پاسخ
                }).ToList();

                return Ok(new { Message = "پاسخ‌ها بررسی شدند.", Results = result });
            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }
        }
    }
}
