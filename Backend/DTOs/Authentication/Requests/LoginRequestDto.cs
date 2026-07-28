using System.ComponentModel.DataAnnotations;
namespace SkyVault.DTOs.Authentication.Requests;
public class LoginRequestDto
{
    [Required]
    [EmailAddress]
    [StringLength(255)]
    public string Email { get; set; } = null!;

    [Required]
    public string Password { get; set; } = null!;
}