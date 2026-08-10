namespace SkyVault.Services.PhysicalProviderService;

public class ProviderFileResult
{
    public string ProviderObjectId { get; set; } = null!;

    public string FileName { get; set; } = null!;

    public string MimeType { get; set; } = null!;

    public long FileSizeBytes { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? ModifiedAt { get; set; }
}