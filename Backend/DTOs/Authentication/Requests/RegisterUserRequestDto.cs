using System.ComponentModel.DataAnnotations;

namespace SkyVault.DTOs.Authentication.Requests;

public class RegisterUserRequestDto
{
    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = null!;

    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = null!;

    [Required]
    [EmailAddress]
    [StringLength(255)]
    public string Email { get; set; } = null!;

    [Required]
    [StringLength(100, MinimumLength = 8)]
    public string Password { get; set; } = null!;
}