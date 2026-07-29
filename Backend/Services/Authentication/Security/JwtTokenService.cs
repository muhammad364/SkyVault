using Microsoft.Extensions.Options;
using SkyVault.Configurations;
using SkyVault.Models;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace SkyVault.Services.Authentication.Security;

public class JwtTokenService : IJwtTokenService
{
    private readonly JwtSettings _jwtSettings;

    public JwtTokenService(IOptions<JwtSettings> jwtOptions)
    {
        _jwtSettings = jwtOptions.Value;
    }

    public int GetAccessTokenExpiryInMinutes()
    {
        return _jwtSettings.ExpiryInMinutes;
    }
     private string CreateToken(User user, string purpose, int expiryInMinutes)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Userid.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("Purpose", purpose)
        };

        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));

        var signingCredentials = new SigningCredentials(
            securityKey,
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryInMinutes),
            signingCredentials: signingCredentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateAccessToken(User user)
    {
        return CreateToken(user, "Access", _jwtSettings.ExpiryInMinutes);
    }
    public string GenerateEmailVerificationToken(User user)
    {
        return CreateToken(user, "EmailVerification", _jwtSettings.ExpiryInMinutes);
    }
    public string GeneratePasswordResetToken(User user)
    {
        return CreateToken(user, "PasswordReset", _jwtSettings.ExpiryInMinutes);
    }
    public ClaimsPrincipal? ValidateToken(string token, string expectedPurpose)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = _jwtSettings.Issuer,

            ValidateAudience = true,
            ValidAudience = _jwtSettings.Audience,

            ValidateIssuerSigningKey = true,
            
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey)),

            ValidateLifetime = true,

            ClockSkew = TimeSpan.Zero
        };

        try
        {
            var principal = tokenHandler.ValidateToken(token, validationParameters, out _);

            if (principal.FindFirst("Purpose")?.Value != expectedPurpose)
            {
                return null;
            }

            return principal;
        }
        catch
        {
            return null;
        }
    }
}
