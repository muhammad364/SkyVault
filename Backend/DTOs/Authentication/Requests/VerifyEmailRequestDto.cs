using System.ComponentModel.DataAnnotations;
namespace SkyVault.DTOs.Authentication.Requests;
public class VerifyEmailRequestDto
{
    [Required]
    public string Token { get; set; } = null!;
}