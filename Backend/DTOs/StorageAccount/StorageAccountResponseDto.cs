namespace SkyVault.DTOs.StorageAccount;

public class StorageAccountResponseDto
{
    public Guid StorageAccountId { get; set; }

    public Guid ProviderId { get; set; }

    public string ProviderName { get; set; } = null!;

    public string ProviderType { get; set; } = null!;

    public string AccountName { get; set; } = null!;

    public long TotalCapacityBytes { get; set; }

    public long UsedCapacityBytes { get; set; }

    public long AvailableCapacityBytes { get; set; }

    public int Priority { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }
}