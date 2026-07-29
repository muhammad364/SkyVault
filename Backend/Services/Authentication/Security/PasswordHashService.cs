using Microsoft.AspNetCore.Identity;

namespace SkyVault.Services.Authentication.Security;

public class PasswordHashService : IPasswordHashService
{
    private readonly Microsoft.AspNetCore.Identity.PasswordHasher<string> _passwordHasher;

    public PasswordHashService()
    {
        _passwordHasher = new Microsoft.AspNetCore.Identity.PasswordHasher<string>();
    }

    public string HashPassword(string password)
    {
        return _passwordHasher.HashPassword(null!, password);
    }

    public bool VerifyPassword(string hashedPassword, string providedPassword)
    {
        var result = _passwordHasher.VerifyHashedPassword(null!, hashedPassword, providedPassword);

        return result == PasswordVerificationResult.Success || result == PasswordVerificationResult.SuccessRehashNeeded;
    }
}