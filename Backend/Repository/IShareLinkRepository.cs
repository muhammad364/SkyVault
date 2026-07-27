using SkyVault.Models;

namespace SkyVault.Repository;

public interface IShareLinkRepository
{
    Task AddAsync(
        Sharelink shareLink,
        CancellationToken cancellationToken = default);

    Task<Sharelink?> GetByIdAsync(
        Guid shareLinkId,
        CancellationToken cancellationToken = default);

    Task<Sharelink?> GetByTokenAsync(
        string shareToken,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<Sharelink>> GetByFileIdAsync(
        Guid fileId,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<Sharelink>> GetByOwnerIdAsync(
        Guid ownerId,
        CancellationToken cancellationToken = default);

    void Update(Sharelink shareLink);
}