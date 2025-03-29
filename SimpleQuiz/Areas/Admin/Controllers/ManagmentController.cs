using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace SimpleQuiz.Areas.Admin.Controllers
{
    [Route("ManagmentApi")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class ManagmentController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly DB _db;

        public ManagmentController(UserManager<ApplicationUser> userManager, DB db)
        {
            _userManager = userManager;
            _db = db;
        }
        // ویرایش کاربر
        [HttpPost]
        [Route("Edit")]
        public async Task<IActionResult> Edit(ApplicationUserByRole user)
        {
            if (ModelState.IsValid)
            {
                var existingUser = await _userManager.FindByIdAsync(user.Id.ToString());
                if (existingUser == null)
                {
                    return Ok(new { success = false, message = "User not found." });
                }
                
                existingUser.UserName = user.UserName;
                existingUser.Email = user.Email;
                existingUser.PhoneNumber = user.PhoneNumber;
                existingUser.FullName = user.FullName;
                existingUser.Bio = user.Bio;
                existingUser.WebSite = user.WebSite;
                existingUser.BirthDay = user.BirthDay;
                existingUser.Gender = user.Gender;

                var result = await _userManager.UpdateAsync(existingUser);
                if (result.Succeeded)
                {
                    _db.UpdateRole(user.Id,user.RoleId);
                    return Ok(new { success = true });
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                    return Ok(new { success = false, message = "Update failed.", errors = result.Errors });
                }
            }
            return Ok(new { success = false, message = "Invalid data." });
        }
        [HttpPost]
        [Route("QuizManagerAsync")]
        public async Task<IActionResult> QuizManagerAsync([FromBody] QuizInfo quiz)
        {
            try
            {
                var res = _db.AddOrUpdateQuiz(quiz);
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }
        }
    }
}
