using System.ComponentModel.DataAnnotations;
namespace SkyVault.DTOs.Authentication.Requests;
public class ForgotPasswordRequestDto
{
    [Required]
    [EmailAddress]
    [StringLength(255)]
    public string Email { get; set; } = null!;
}