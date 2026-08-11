namespace SkyVault.DTOs.Admin;

public class UserStorageAllocationDto
{
    public Guid UserId { get; set; }
    public string UserEmail { get; set; } = null!;
    public long AllocatedBytes { get; set; }
    public long UsedBytes { get; set; }
    public long AvailableBytes { get; set; }
}