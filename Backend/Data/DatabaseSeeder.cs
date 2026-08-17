using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using SkyVault.Data;
using SkyVault.Models;

namespace SkyVault.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<SkyVaultDbContext>();

        if (await context.Users.AnyAsync(u => u.Role == 1))
            return;

        var passwordHasher = new PasswordHasher<User>();

        var admin = new User
        {
            Userid = Guid.NewGuid(),

            Firstname = "Muhammad",

            Lastname = "Haroon Khalid",

            Email = "haroonawan@gmail.com",

            Role = 1,

            Isemailverified = true,

            Isactive = true,

            Allocatedstoragebytes = 0,

            Usedstoragebytes = 0,

            Createdat = DateTime.UtcNow
        };

        admin.Passwordhash = passwordHasher.HashPassword(admin, "harry@1710");

        context.Users.Add(admin);

        await context.SaveChangesAsync();
    }
}