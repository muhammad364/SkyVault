
using System.ComponentModel.DataAnnotations;

namespace SkyVault.DTOs.UserFile.Requests;

public class UploadFileRequestDto
{
    [Required]
    public IFormFile File { get; set; } = null!;

    public Guid? FolderId { get; set; }
}