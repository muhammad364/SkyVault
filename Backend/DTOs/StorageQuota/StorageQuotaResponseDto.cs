namespace SkyVault.DTOs.StorageQuota;

public class StorageQuotaResponseDto
{
    public long AllocatedStorageBytes { get; set; }

    public long UsedStorageBytes { get; set; }

    public long AvailableStorageBytes { get; set; }

    public decimal UsagePercentage { get; set; }

    public bool HasActiveSubscription { get; set; }

    public bool CanPerformStorageWriteOperations { get; set; }

    public bool IsOverQuota { get; set; }
}