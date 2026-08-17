namespace SkyVault.DTOs.Admin;
public class SystemStatisticsDto
{
    public int TotalUsers { get; set; }

    public int ActiveUsers { get; set; }

    public int TotalStoragePlans { get; set; }

    public int ActiveStoragePlans { get; set; }

    public int TotalSubscriptions { get; set; }

    public int ActiveSubscriptions { get; set; }
}