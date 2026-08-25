namespace SkyVault.Services.Authentication.Security;

public interface IPasswordHashService
{
    string HashPassword(string password);

    bool VerifyPassword(string hashedPassword, string providedPassword);
}
