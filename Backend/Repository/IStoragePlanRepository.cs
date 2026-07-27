using SkyVault.Models;

namespace SkyVault.Repository;
public interface IStoragePlanRepository
{
    Task<IEnumerable<Storageplan>> GetAllAsync(bool? isActive = null, CancellationToken cancellationToken = default);

    Task<Storageplan?> GetByIdAsync(Guid storagePlanId, CancellationToken cancellationToken = default);

    Task<Storageplan?> GetByNameAsync(string name, CancellationToken cancellationToken = default);

    Task AddAsync(Storageplan storagePlan, CancellationToken cancellationToken = default);

    void Update(Storageplan storagePlan);
}