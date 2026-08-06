using Microsoft.EntityFrameworkCore;
using SkyVault.Data;
using SkyVault.Models;

namespace SkyVault.Repository;

public class StorageProviderRepository : IStorageProviderRepository
{
    private readonly SkyVaultDbContext _dbcontext;

    public StorageProviderRepository(SkyVaultDbContext skyVaultDbContext)
    {
        _dbcontext = skyVaultDbContext;
    }

    public async Task<IEnumerable<Storageprovider>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbcontext.Storageproviders.ToListAsync(cancellationToken);
    }

    public async Task<Storageprovider?> GetByIdAsync(Guid storageProviderId, CancellationToken cancellationToken = default)
    {
        return await _dbcontext.Storageproviders.FirstOrDefaultAsync(p => p.Providerid == storageProviderId, cancellationToken);
    }

    public async Task<Storageprovider?> GetByNameAsync(string name,CancellationToken cancellationToken = default)
    {
        return await _dbcontext.Storageproviders.FirstOrDefaultAsync(p => p.Name == name, cancellationToken);
    }

    public async Task AddAsync(Storageprovider storageProvider, CancellationToken cancellationToken = default)
    {
        await _dbcontext.Storageproviders.AddAsync(storageProvider, cancellationToken);
    }

    public void Update(Storageprovider storageProvider)
    {
        _dbcontext.Storageproviders.Update(storageProvider);
    }
}