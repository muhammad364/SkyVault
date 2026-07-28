namespace SkyVault.DTOs.Authentication.Responses;
public class RegisterUserResponseDto
{
    public Guid UserId { get; set; }

    public string Message { get; set; } = null!;
}