namespace SkyVault.DTOs.Folder.Responses;

public class FileSummaryDto
{
    public Guid FileId { get; set; }

    public string FileName { get; set; } = null!;

    public string Extension { get; set; } = null!;

    public long FileSizeBytes { get; set; }

    public DateTime UpdatedAt { get; set; }
}