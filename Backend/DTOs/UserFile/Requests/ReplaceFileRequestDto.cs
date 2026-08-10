
using System.ComponentModel.DataAnnotations;

namespace SkyVault.DTOs.UserFile.Requests;

public class ReplaceFileRequestDto
{
    [Required]
    public IFormFile File { get; set; } = null!;
}