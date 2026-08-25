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

    public async Task AddAsync(Subscription subscription, CancellationToken cancellationToken = default)
    {
        await _dbContext.Subscriptions.AddAsync(subscription, cancellationToken);
    }

    public async Task<Subscription?> GetByIdAsync(Guid subscriptionId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Subscriptions.FirstOrDefaultAsync(s => s.Subscriptionid == subscriptionId, cancellationToken);
    }

    public async Task<IEnumerable<Subscription>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Subscriptions.AsNoTracking().Include(s => s.Storageplan).Where(s => s.Userid == userId).OrderByDescending(s => s.Startdate).ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Subscription>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Subscriptions.AsNoTracking().Include(s => s.User).Include(s => s.Storageplan).ToListAsync(cancellationToken);
    }

    public void Update(Subscription subscription)
    {
        _dbContext.Subscriptions.Update(subscription);
    }
}
