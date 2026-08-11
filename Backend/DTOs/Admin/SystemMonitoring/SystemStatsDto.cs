namespace SkyVault.DTOs.Admin;

public class SystemStatisticsDto
{
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int VerifiedUsers { get; set; }
    public int TotalStoragePlans { get; set; }
    public int ActiveStoragePlans { get; set; }
    public int ActiveSubscriptions { get; set; }
    public int TotalFiles { get; set; }
    public int TotalFolders { get; set; }
    public long TotalAllocatedBytes { get; set; }
    public long TotalUsedBytes { get; set; }
}