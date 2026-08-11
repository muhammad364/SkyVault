namespace SkyVault.DTOs.Admin;

public class StoragePlanDto
{
    public Guid StoragePlanId { get; set; }
    public string Name { get; set; } = null!;
    public decimal StorageSizeGb { get; set; }
    public decimal Price { get; set; }
    public short BillingCycle { get; set; }
    public bool IsActive { get; set; }
}