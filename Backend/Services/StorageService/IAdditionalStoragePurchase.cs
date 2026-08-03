using SkyVault.DTOs.AdditionalStoragePurchase;

namespace SkyVault.Services.StorageService.AdditionalStoragePurchase;
public interface IAdditionalStoragePurchaseService
{
    Task<PurchaseAdditionalStorageResponseDto> PurchaseAsync(Guid userId, PurchaseAdditionalStorageRequestDto request, CancellationToken cancellationToken = default);

    Task<IEnumerable<PurchaseAdditionalStorageResponseDto>>GetCurrentUserPurchasesAsync(Guid userId, CancellationToken cancellationToken = default);
}