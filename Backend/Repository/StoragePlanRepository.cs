using Microsoft.EntityFrameworkCore;
using SkyVault.Data;
using SkyVault.Models;
using SkyVault.Repository;

namespace SkyVault.Repository;

public class StoragePlanRepository : IStoragePlanRepository
{
    private readonly SkyVaultDbContext _dbContext;

    public StoragePlanRepository(SkyVaultDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Storageplan>> GetAllAsync(
        bool? isActive = null,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Storageplan> query = _dbContext.Storageplans;

        if (isActive.HasValue)
        {
            query = query.Where(p => p.Isactive == isActive.Value);
        }

        return await query.ToListAsync(cancellationToken);
    }

    public async Task<Storageplan?> GetByIdAsync(
        Guid storagePlanId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Storageplans
            .FirstOrDefaultAsync(
                p => p.Storageplanid == storagePlanId,
                cancellationToken);
    }

    public async Task<Storageplan?> GetByNameAsync(
        string name,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Storageplans
            .FirstOrDefaultAsync(
                p => p.Name == name,
                cancellationToken);
    }

    public async Task AddAsync(
        Storageplan storagePlan,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.Storageplans
            .AddAsync(storagePlan, cancellationToken);
    }

    public void Update(Storageplan storagePlan)
    {
        _dbContext.Storageplans.Update(storagePlan);
    }
}