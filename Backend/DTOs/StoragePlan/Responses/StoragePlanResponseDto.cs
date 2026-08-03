namespace SkyVault.DTOs.StoragePlan.Responses;

public class StoragePlanResponseDto
{
    public Guid StoragePlanId { get; set; }

    public string Name { get; set; } = null!;

    public int StorageSizeGb { get; set; }

    public decimal Price { get; set; }

    public short BillingCycle { get; set; }

    public bool IsActive { get; set; }
}