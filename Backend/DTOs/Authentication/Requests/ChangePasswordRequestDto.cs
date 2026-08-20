using System.ComponentModel.DataAnnotations;

namespace SkyVault.DTOs.Authentication.Requests;

public class ChangePasswordRequestDto
{
    [Required]
    public string CurrentPassword { get; set; } = null!;

    [Required]
    [StringLength(100, MinimumLength = 8)]
    public string NewPassword { get; set; } = null!;
}
