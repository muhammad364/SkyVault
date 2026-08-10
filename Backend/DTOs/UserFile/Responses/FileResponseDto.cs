namespace SkyVault.DTOs.UserFile.Responses;
public class FileResponseDto
{
    public Guid FileId { get; set; }
    public Guid FolderId { get; set; }

    public string FileName { get; set; } = null!;
    public string Extension { get; set; } = null!;
    public string MimeType { get; set; } = null!;

    public long FileSizeBytes { get; set; }

    public DateTime UploadedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}