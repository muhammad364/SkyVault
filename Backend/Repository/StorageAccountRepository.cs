using Microsoft.EntityFrameworkCore;
using SkyVault.Data;
using SkyVault.Models;

namespace SkyVault.Repository;

public class StorageAccountRepository : IStorageAccountRepository
{
    private readonly SkyVaultDbContext _dbcontext;

    public StorageAccountRepository(SkyVaultDbContext skyVaultDbContext)
    {
        _dbcontext = skyVaultDbContext;
    }

    public async Task AddAsync(Storageaccount storageAccount, CancellationToken cancellationToken = default)
    {
        await _dbcontext.Storageaccounts.AddAsync(storageAccount, cancellationToken);
    }

    public async Task<Storageaccount?> GetByIdAsync(Guid storageAccountId, CancellationToken cancellationToken = default)
    {
        return await _dbcontext.Storageaccounts.FirstOrDefaultAsync(s => s.Storageaccountid == storageAccountId, cancellationToken);
    }

    public async Task<IEnumerable<Storageaccount>> GetAllAsync(bool? isActive = null, CancellationToken cancellationToken = default)
    {
        IQueryable<Storageaccount> query = _dbcontext.Storageaccounts;

        if (isActive.HasValue)
        {
            query = query.Where(s => s.Isactive == isActive.Value);
        }

        return await query.ToListAsync(cancellationToken);
    }

    public void Update(Storageaccount storageAccount)
    {
        _dbcontext.Storageaccounts.Update(storageAccount);
    }
}