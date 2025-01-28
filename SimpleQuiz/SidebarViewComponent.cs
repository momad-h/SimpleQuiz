using Microsoft.AspNetCore.Mvc;

namespace SimpleQuiz
{
    public class SidebarViewComponent : ViewComponent
    {
        private readonly DB _db;
        public SidebarViewComponent(DB db)
        {
            _db = db;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var data = await _db.AsyncGetQuizInfo();
            return View(data);
        }
    }

}
