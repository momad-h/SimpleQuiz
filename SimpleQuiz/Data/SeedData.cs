using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace SimpleQuiz
{
    public class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            string[] roleNames = { "Admin", "User","Manager" };
            foreach (var roleName in roleNames)
            {
                //var roleExist = await roleManager.RoleExistsAsync(roleName);
                var roleExist = await roleManager.Roles.AnyAsync(r => r.Name == roleName);
                if (!roleExist)
                {
                    await roleManager.CreateAsync(new IdentityRole<int>(roleName));
                }
            }

            var adminUser = new ApplicationUser
            {
                UserName = "admin@example.com",
                Email = "admin@example.com"
            };

            string adminPassword = "Admin@123";
            var user = await userManager.FindByEmailAsync(adminUser.Email);

            if (user == null)
            {
                var createPowerUser = await userManager.CreateAsync(adminUser, adminPassword);
                if (createPowerUser.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }
        }
    }
}