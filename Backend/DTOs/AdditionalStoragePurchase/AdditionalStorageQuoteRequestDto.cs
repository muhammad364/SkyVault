using System.ComponentModel.DataAnnotations;

namespace SkyVault.DTOs.AdditionalStoragePurchase;

public class AdditionalStorageQuoteRequestDto
{
    [Range(1, int.MaxValue)]
    public int StorageAmountGb { get; set; }
}