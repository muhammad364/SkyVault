namespace SkyVault.DTOs.Admin;

public class UpdateStoragePlanDto
{
    public string Name { get; set; } = null!;
    public decimal StorageSizeGb { get; set; }
    public decimal Price { get; set; }
    public short BillingCycle { get; set; }
}