using SkyVault.Models;

namespace SkyVault.Repository;

public interface IStorageProviderRepository
{
    Task<IEnumerable<Storageprovider>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<Storageprovider?> GetByIdAsync(Guid storageProviderId, CancellationToken cancellationToken = default);

    Task AddAsync(Storageprovider storageProvider, CancellationToken cancellationToken = default);

    Task<Storageprovider?> GetByNameAsync(string name, CancellationToken cancellationToken = default);

    void Update(Storageprovider storageProvider);
}
