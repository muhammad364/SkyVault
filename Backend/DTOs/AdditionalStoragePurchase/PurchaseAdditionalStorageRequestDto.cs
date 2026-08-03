using System.ComponentModel.DataAnnotations;
using SkyVault.DTOs.Payments;

namespace SkyVault.DTOs.AdditionalStoragePurchase;

public class PurchaseAdditionalStorageRequestDto
{
    [Range(1, int.MaxValue)]
    public int StorageAmountGb { get; set; }

    [Required]
    public ProcessPaymentRequestDto Payment { get; set; } = null!;
}