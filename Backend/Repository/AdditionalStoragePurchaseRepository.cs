using Microsoft.EntityFrameworkCore;
using SkyVault.Data;
using SkyVault.Models;

namespace SkyVault.Repository;

public class AdditionalStoragePurchaseRepository : IAdditionalStoragePurchaseRepository
{
    private readonly SkyVaultDbContext _dbcontext;

    public AdditionalStoragePurchaseRepository(SkyVaultDbContext skyVaultDbContext)
    {
        _dbcontext = skyVaultDbContext;
    }

    public async Task AddAsync(Additionalstoragepurchase purchase, CancellationToken cancellationToken = default)
    {
        await _dbcontext.Additionalstoragepurchases.AddAsync(purchase, cancellationToken);
    }

    public async Task<Additionalstoragepurchase?> GetByIdAsync(Guid purchaseId, CancellationToken cancellationToken = default)
    {
        return await _dbcontext.Additionalstoragepurchases.FirstOrDefaultAsync(p => p.Additionalstoragepurchaseid == purchaseId, cancellationToken);
    }

    public async Task<IEnumerable<Additionalstoragepurchase>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbcontext.Additionalstoragepurchases.Where(p => p.Userid == userId).ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Additionalstoragepurchase>> GetAllAsync(short? status = null, CancellationToken cancellationToken = default)
    {
        IQueryable<Additionalstoragepurchase> query = _dbcontext.Additionalstoragepurchases;

        if (status.HasValue)
        {
            query = query.Where(p => p.Status == status.Value);
        }

        return await query.ToListAsync(cancellationToken);
    }
}

