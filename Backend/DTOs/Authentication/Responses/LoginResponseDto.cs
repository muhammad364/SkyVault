
namespace SkyVault.DTOs.Authentication.Responses;
public class LoginResponseDto
{
    public string Token { get; set; } = null!;

    public DateTime ExpiresAt { get; set; }
}