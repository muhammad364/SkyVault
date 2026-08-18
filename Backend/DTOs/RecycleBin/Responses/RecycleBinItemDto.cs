namespace SkyVault.DTOs.RecycleBin.Responses;

public class RecycleBinItemDto
{
    public Guid ItemId { get; set; }

    public string ItemType { get; set; } = null!;

    public string Name { get; set; } = null!;

    public Guid? OriginalParentFolderId { get; set; }

    public string? Extension { get; set; }

    public string? MimeType { get; set; }

    public long? FileSizeBytes { get; set; }

    public DateTime DeletedAt { get; set; }

    public DateTime ExpiresAt { get; set; }
}
