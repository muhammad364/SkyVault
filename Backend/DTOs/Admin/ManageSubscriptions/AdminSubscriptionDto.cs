namespace SkyVault.DTOs.Admin;

public class AdminSubscriptionDto
{
    public Guid SubscriptionId { get; set; }
    public Guid UserId { get; set; }
    public string UserEmail { get; set; } = null!;
    public Guid StoragePlanId { get; set; }
    public string StoragePlanName { get; set; } = null!;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public short Status { get; set; }
}