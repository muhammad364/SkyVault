namespace SkyVault.DTOs.StorageProvider;

public class StorageProviderResponseDto
{
    public Guid ProviderId { get; set; }

    public string Name { get; set; } = null!;

    public string ProviderType { get; set; } = null!;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }
}