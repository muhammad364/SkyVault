using SkyVault.Models;

namespace SkyVault.Repository;

public interface IStorageAccountRepository
{
    Task AddAsync(Storageaccount storageAccount, CancellationToken cancellationToken = default);

    Task<Storageaccount?> GetByIdAsync(Guid storageAccountId, CancellationToken cancellationToken = default);

    Task<IEnumerable<Storageaccount>> GetAllAsync(bool? isActive = null, CancellationToken cancellationToken = default);

    Task<bool> TryReserveCapacityAsync(Guid storageAccountId, long capacityBytes, CancellationToken cancellationToken = default);

    Task<bool> ReleaseCapacityAsync(Guid storageAccountId, long capacityBytes, CancellationToken cancellationToken = default);

    void Update(Storageaccount storageAccount);
}
