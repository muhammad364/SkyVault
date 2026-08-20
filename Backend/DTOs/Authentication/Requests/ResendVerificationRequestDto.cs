using System.ComponentModel.DataAnnotations;

namespace SkyVault.DTOs.Authentication.Requests;

public class ResendVerificationRequestDto
{
    [Required]
    [EmailAddress]
    [StringLength(255)]
    public string Email { get; set; } = null!;
}
