using SkyVault.DTOs.Subscription;

namespace SkyVault.Services.StorageService;

public interface ISubscriptionService
{
    Task<SubscriptionResponseDto> SubscribeAsync(Guid userId, SubscribeRequestDto request, CancellationToken cancellationToken = default);

    Task<SubscriptionResponseDto?> GetCurrentSubscriptionAsync(Guid userId, CancellationToken cancellationToken = default);
}