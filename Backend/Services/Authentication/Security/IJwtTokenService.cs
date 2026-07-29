using System.Security.Claims;
using SkyVault.Models;

namespace SkyVault.Services.Authentication.Security;

public interface IJwtTokenService
{
    int GetAccessTokenExpiryInMinutes();
    string GenerateAccessToken(User user);

    string GenerateEmailVerificationToken(User user);

    string GeneratePasswordResetToken(User user);

    ClaimsPrincipal? ValidateToken(string token, string expectedPurpose);
}