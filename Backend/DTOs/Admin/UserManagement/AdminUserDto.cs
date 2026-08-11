namespace SkyVault.DTOs.Admin;

public class AdminUserDto
{
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public bool IsVerified { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}