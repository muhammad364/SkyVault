using SkyVault.Models;

namespace SkyVault.Repository;
public interface ISubscriptionRepository
{
    Task AddAsync(Subscription subscription, CancellationToken cancellationToken = default);

    Task<Subscription?> GetByIdAsync(Guid subscriptionId, CancellationToken cancellationToken = default);

    Task<IEnumerable<Subscription>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<IEnumerable<Subscription>> GetAllAsync(CancellationToken cancellationToken = default);

    void Update(Subscription subscription);
}