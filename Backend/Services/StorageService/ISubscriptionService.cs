using SkyVault.DTOs.Subscription;

namespace SkyVault.Services.SubscriptionService;

public interface ISubscriptionService
{
    Task<SubscriptionResponseDto> SubscribeAsync(Guid userId, SubscribeRequestDto request, CancellationToken cancellationToken = default);

    Task<SubscriptionResponseDto?> GetCurrentSubscriptionAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<SubscriptionResponseDto> RenewAsync(Guid userId, RenewSubscriptionRequestDto request, CancellationToken cancellationToken = default);

    Task<SubscriptionResponseDto> CancelAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<int> ExpireDueSubscriptionsAsync(CancellationToken cancellationToken = default);

    // For admin operations only
    Task<IEnumerable<SubscriptionResponseDto>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<SubscriptionResponseDto> GetByIdAsync(Guid subscriptionId, CancellationToken cancellationToken = default);

    Task<IEnumerable<SubscriptionResponseDto>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
}
