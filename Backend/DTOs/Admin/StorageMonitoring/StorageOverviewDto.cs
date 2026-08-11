namespace SkyVault.DTOs.Admin;

public class StorageOverviewDto
{
    public long TotalPhysicalCapacityBytes { get; set; }
    public long TotalAllocatedBytes { get; set; }
    public long TotalUsedBytes { get; set; }
    public long TotalAvailableBytes { get; set; }
}