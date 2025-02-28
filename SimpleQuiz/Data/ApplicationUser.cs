using Microsoft.AspNetCore.Identity;

namespace SimpleQuiz
{
    public class ApplicationUser : IdentityUser<int>, IHasExtraInfo
    {
        public string? FullName { get; set; }
        public string? Bio { get; set; }
        public string? WebSite { get; set; }
        public DateTime BirthDay { get; set; }
        public bool Gender { get; set; }
    }
    public class ApplicationUserByRole : ApplicationUser
    {
        public int RoleId { get; set; }
    }
}
