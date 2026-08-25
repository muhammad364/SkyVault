using SkyVault.DTOs.AdditionalStoragePurchase;

namespace SkyVault.Services.SubscriptionService;

public interface IAdditionalStoragePurchaseService
{
    Task<PurchaseAdditionalStorageResponseDto> PurchaseAsync(Guid userId, PurchaseAdditionalStorageRequestDto request, CancellationToken cancellationToken = default);

    Task<IEnumerable<PurchaseAdditionalStorageResponseDto>>GetCurrentUserPurchasesAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<AdditionalStorageQuoteResponseDto> GetQuoteAsync(Guid userId, AdditionalStorageQuoteRequestDto request, CancellationToken cancellationToken = default);

    Task ActivatePurchasesAsync(Guid userId, CancellationToken cancellationToken = default);

    Task DeactivatePurchasesAsync(Guid userId, CancellationToken cancellationToken = default);
}
