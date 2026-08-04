namespace SkyVault.DTOs.AdditionalStoragePurchase;

public class AdditionalStorageQuoteResponseDto
{
    public int StorageAmountGb { get; set; }

    public decimal PricePerGb { get; set; }

    public decimal TotalPrice { get; set; }
}