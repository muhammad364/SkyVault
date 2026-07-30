using System.ComponentModel.DataAnnotations;

namespace SkyVault.DTOs.Folder.Requests;

public class CreateFolderRequestDto
{
    [Required]
    [StringLength(255)]
    public string Name { get; set; } = null!;

    public Guid? ParentFolderId { get; set; }
}