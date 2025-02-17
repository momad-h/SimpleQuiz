using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace SimpleQuiz
{
    public static class UserManagerExtensions
    {
        public static string? GetFullName(this UserManager<ApplicationUser> userManager, ClaimsPrincipal principal)
        {
            ArgumentNullException.ThrowIfNull(principal);

            // دریافت مقدار FullName از claimها
            return principal.FindFirstValue("FullName");
        }
    }
}
