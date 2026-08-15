using System.ComponentModel.DataAnnotations;

namespace SkyVault.DTOs.StoragePlan.Requests;

public class CreateStoragePlanRequestDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = null!;

    [Range(1, int.MaxValue)]
    public int StorageSizeGb { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Range(1, 12)]
    public short BillingCycle { get; set; }

    public bool IsActive { get; set; } = true;
}