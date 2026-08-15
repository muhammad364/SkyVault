namespace SkyVault.DTOs.Search.Responses;

public class SearchResultDto
{
    public Guid FileId { get; set; }

    public string FileName { get; set; } = null!;

    public string FileExtension { get; set; } = null!;

    public string MimeType { get; set; } = null!;

    public long FileSizeBytes { get; set; }

    public Guid? FolderId { get; set; }

    public string? FolderName { get; set; }

    public DateTime UploadedAt { get; set; }

    public DateTime LastModifiedAt { get; set; }
}
