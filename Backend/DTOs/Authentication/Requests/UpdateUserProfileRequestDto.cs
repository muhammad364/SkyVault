using System.ComponentModel.DataAnnotations;
namespace SkyVault.DTOs.Authentication.Requests;
public class UpdateUserProfileRequestDto
{
    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = null!;

    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = null!;
}