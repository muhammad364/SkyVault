namespace SkyVault.DTOs.Authentication.Responses;
public class UserProfileResponseDto
{
    public Guid UserId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public long AllocatedStorageBytes { get; set; }

    public long UsedStorageBytes { get; set; }

    public bool IsEmailVerified { get; set; }
}