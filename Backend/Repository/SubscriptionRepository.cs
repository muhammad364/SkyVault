using SkyVault.Data;
using SkyVault.Models;
using Microsoft.EntityFrameworkCore;

namespace SkyVault.Repository;

public class SubscriptionRepository : ISubscriptionRepository
{
    private readonly SkyVaultDbContext _dbContext;

    public SubscriptionRepository(SkyVaultDbContext skyVaultDbContext)
    {
        _dbContext = skyVaultDbContext;
    }

    public async Task AddAsync(
        Subscription subscription,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.Subscriptions.AddAsync(subscription, cancellationToken);
    }

    public async Task<Subscription?> GetByIdAsync(
        Guid subscriptionId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Subscriptions.FirstOrDefaultAsync(s => s.Subscriptionid == subscriptionId,cancellationToken);
    }

    public async Task<Subscription?> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Subscriptions.FirstOrDefaultAsync(s => s.Userid == userId,cancellationToken);
    }

    public async Task<IEnumerable<Subscription>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Subscriptions.ToListAsync(cancellationToken);
    }

    public void Update(Subscription subscription)
    {
        _dbContext.Subscriptions.Update(subscription);
    }
}