using SkyVault.Models;

namespace SkyVault.Repository;
public interface IAdditionalStoragePurchaseRepository
{
    Task AddAsync(Additionalstoragepurchase purchase, CancellationToken cancellationToken = default);

    Task<Additionalstoragepurchase?> GetByIdAsync(Guid purchaseId, CancellationToken cancellationToken = default);

    Task<IEnumerable<Additionalstoragepurchase>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<IEnumerable<Additionalstoragepurchase>> GetAllAsync(short? status = null, CancellationToken cancellationToken = default);
}
