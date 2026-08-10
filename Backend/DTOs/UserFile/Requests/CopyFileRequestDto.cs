using System.ComponentModel.DataAnnotations;

namespace SkyVault.DTOs.UserFile.Requests;

public class CopyFileRequestDto
{
    [Required]
    [MinLength(1)]
    public List<Guid> FileIds { get; set; } = new();

    public Guid? DestinationFolderId { get; set; }
}