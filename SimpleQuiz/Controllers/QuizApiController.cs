using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SimpleQuiz.Models;
using Newtonsoft.Json;
using System.Reflection;
using Microsoft.AspNetCore.Http.HttpResults;

namespace SimpleQuiz.Controllers
{
    [Route("qApi/[controller]")]
    [ApiController]
    public class QuizApiController : ControllerBase
    {
        private readonly DB _db;
        private readonly TokenService _tokenService;
        public QuizApiController(DB db, TokenService tokenService)
        {
            _db = db;
            _tokenService = tokenService;
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
        [HttpPost("SendResultToServer2")]
        public IActionResult SendResultToServer([FromBody] dynamic model)
        {
            try
            {
                var x = model;
                return Ok();
            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }
        }
        [HttpPost("SendResultToServer")]
        public IActionResult SendResultToServer([FromBody] QuizSubmissionModel model, [FromQuery] string userName)
        {
            try
            {
                if (model?.Answers == null || model.Answers.Count == 0)
                {
                    return BadRequest(new { Message = "پاسخی ارسال نشده است." });
                }

                // بررسی پاسخ‌ها
                var result = model.Answers.Select(answer => new
                {
                    QuestionText=answer.Question,
                    QuestionId = answer.Name,
                    Answer = answer.Value,
                    Response=answer.Response,
                    IsCorrect = _db.CheckAnswer2(answer.Name, answer.Value).IsCorrect, // بررسی درست یا غلط بودن پاسخ
                    CorrectOpion= _db.CheckAnswer2(answer.Name, answer.Value).Questions,
                    Score= _db.CheckAnswer2(answer.Name, answer.Value).Score
                }).ToList();

                var userQuizList = model.Answers.Select(answer => new UserQuizViewModel
                {
                    QuestionId = answer.Name,
                    Answer = answer.Value,
                    IsCorrect = _db.CheckAnswer(answer.Name, answer.Value) // بررسی درست یا غلط بودن پاسخ
                }).ToList();
                
                _db.SaveQuizHistory(userName, userQuizList);

                return Ok(new { Message = "پاسخ‌ها بررسی شدند.", Results = result });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Signup")]
        public IActionResult Signup(UserInfoViewModel user)
        {
            try
            {

                return Ok(_db.Signup(user));

            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Login")]
        public IActionResult Login(UserInfoViewModel user)
        {
            UserInfoViewModel userInfo;
            try
            {
                userInfo = _db.UserInfo(user);
                if (userInfo == null)
                {
                    userInfo = new UserInfoViewModel { UserName = "-1", Password = "-1" };
                    return Ok(userInfo);
                }
                if (user.UserName.ToLower() == userInfo.UserName.ToLower() && user.Password == userInfo.Password)
                    return Ok(userInfo);
                else
                {
                    userInfo = new UserInfoViewModel { UserName = "-1", Password = "-1" };
                    return Ok(userInfo);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        public IActionResult CheckExists(UserInfoViewModel user)
        {
            try
            {
                if (_db.UserInfo(user) != null)

                    return Ok(true);

                else
                    return Ok(false);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("GenerateSecureLink")]
        public IActionResult GenerateSecureLink(string action,string controller,string page)
        {
            var token = _tokenService.CreateToken(page);
            var secureLink = Url.Action(action, controller, new { token = token }, Request.Scheme);
            return Ok(secureLink);
        }
    }
}
