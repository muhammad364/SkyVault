using SkyVault.Models;

namespace SkyVault.Repository;

public interface IRecycleBinRepository
{
    Task<IEnumerable<Folder>> GetDeletedFoldersByOwnerAsync(
        Guid ownerId,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<Userfile>> GetDeletedFilesByOwnerAsync(
        Guid ownerId,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<Folder>> GetExpiredDeletedFoldersAsync(
        DateTime expiredBefore,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<Userfile>> GetExpiredDeletedFilesAsync(
        DateTime expiredBefore,
        CancellationToken cancellationToken = default);
}
