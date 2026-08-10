using System.ComponentModel.DataAnnotations;

namespace SkyVault.DTOs.UserFile.Requests;

public class RenameFileRequestDto
{
    [Required]
    [MaxLength(255)]
    public string FileName { get; set; } = null!;
}