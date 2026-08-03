namespace SkyVault.DTOs.AdditionalStoragePurchase;

public class PurchaseAdditionalStorageResponseDto
{
    public Guid AdditionalStoragePurchaseId { get; set; }

    public int StorageAmountGb { get; set; }

    public decimal Price { get; set; }

    public DateTime PurchaseDate { get; set; }

    public short Status { get; set; }
}