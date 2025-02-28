using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace SimpleQuiz.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")] // فقط مدیران می‌توانند به این کنترلر دسترسی داشته باشند
    public class UserController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly DB _db;
        public UserController(UserManager<ApplicationUser> userManager, DB db)
        {
            _userManager = userManager;
            _db = db;
        }

        // لیست کاربران
        public IActionResult Index()
        {
            var users = _userManager.Users.ToList();
            return View(users);
        }

        // صفحه‌ی ایجاد کاربر جدید
        public IActionResult Create()
        {
            return View();
        }

        // ایجاد کاربر جدید
        [HttpPost]
        public async Task<IActionResult> Create(ApplicationUser user, string password)
        {
            if (ModelState.IsValid)
            {
                var result = await _userManager.CreateAsync(user, password);
                if (result.Succeeded)
                {
                    return RedirectToAction("Index");
                }
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }
            return View(user);
        }

        // صفحه‌ی ویرایش کاربر
        
        public async Task<IActionResult> Edit(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user != null)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var role=roles.FirstOrDefault();
                ViewBag.Role = role;
                ViewBag.Roles = _db.RoleList();
                DateTime date = DateTime.ParseExact(user.BirthDay.ToString(), "M/d/yyyy h:mm:ss tt", System.Globalization.CultureInfo.InvariantCulture);
                var seperateBirthDay = new
                {
                    day = date.Day,
                    month = date.Month,
                    year = date.Year
                };
                ViewBag.BirthDayDitailes = seperateBirthDay;
            }
            if (user == null)
            {
                return NotFound();
            }
            return View(user);
        }
        // حذف کاربر
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return View(user);
        }

        // تایید حذف کاربر
        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                return RedirectToAction("Index");
            }
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
            return View(user);
        }
    }
}
