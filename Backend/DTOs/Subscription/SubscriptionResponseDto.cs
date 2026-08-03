namespace SkyVault.DTOs.Subscription;

public class SubscriptionResponseDto
{
    public Guid SubscriptionId { get; set; }

    public Guid StoragePlanId { get; set; }

    public string StoragePlanName { get; set; } = null!;

    public int StorageSizeGb { get; set; }

    public decimal Price { get; set; }

    public short BillingCycle { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public short Status { get; set; }
}