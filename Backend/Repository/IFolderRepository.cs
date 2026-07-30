using SkyVault.Models;

namespace SkyVault.Repository;

public interface IFolderRepository
{
    Task AddAsync(Folder folder, CancellationToken cancellationToken = default);

    Task<Folder?> GetByIdAsync(
        Guid folderId,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<Folder>> GetByUserIdAsync(
        Guid ownerId,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<Folder>> GetChildFoldersAsync(
        Guid ownerId,
        Guid? parentFolderId,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(
        Guid ownerId,
        Guid? parentFolderId,
        string folderName,
        CancellationToken cancellationToken = default);

    void Update(Folder folder);
    void Remove(Folder folder);
}