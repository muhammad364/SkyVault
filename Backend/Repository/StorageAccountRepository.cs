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

    public async Task<bool> TryReserveCapacityAsync(Guid storageAccountId,long capacityBytes,CancellationToken cancellationToken = default)
    {
        if (capacityBytes <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(capacityBytes), "Capacity reservation must be greater than zero.");
        }

        var affectedRows = await _dbcontext.Storageaccounts
            .Where(s =>s.Storageaccountid == storageAccountId && s.Isactive && 
                s.Provider.Isactive && s.Usedcapacitybytes + capacityBytes <= s.Totalcapacitybytes)
            .ExecuteUpdateAsync(
                setters =>
                    setters.SetProperty(
                        s => s.Usedcapacitybytes,
                        s => s.Usedcapacitybytes + capacityBytes),
                cancellationToken);

        return affectedRows == 1;
    }

    public async Task<bool> ReleaseCapacityAsync(Guid storageAccountId, long capacityBytes, CancellationToken cancellationToken = default)
    {
        if (capacityBytes <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(capacityBytes), "Capacity release must be greater than zero.");
        }

        var affectedRows = await _dbcontext.Storageaccounts.Where(s =>
            s.Storageaccountid == storageAccountId && s.Usedcapacitybytes >= capacityBytes)
                .ExecuteUpdateAsync(
                    setters => setters.SetProperty(
                        s => s.Usedcapacitybytes,
                        s => s.Usedcapacitybytes - capacityBytes), cancellationToken);

        return affectedRows == 1;
    }

    public void Update(Storageaccount storageAccount)
    {
        _dbcontext.Storageaccounts.Update(storageAccount);
    }
}