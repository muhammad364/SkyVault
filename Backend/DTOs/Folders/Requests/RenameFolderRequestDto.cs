using System.ComponentModel.DataAnnotations;

namespace SkyVault.DTOs.Folder.Requests;

public class RenameFolderRequestDto
{
    [Required]
    [StringLength(255)]
    public string Name { get; set; } = null!;
}