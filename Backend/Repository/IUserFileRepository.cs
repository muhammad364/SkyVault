using SkyVault.Models;

namespace SkyVault.Repository;

public interface IUserFileRepository
{
    Task AddAsync(Userfile userFile, CancellationToken cancellationToken = default);

    Task<Userfile?> GetByIdAsync(Guid fileId, CancellationToken cancellationToken = default);

    Task<IEnumerable<Userfile>> GetByUserIdAsync(Guid ownerId, CancellationToken cancellationToken = default);

    Task<IEnumerable<Userfile>> GetByFolderIdAsync(Guid ownerId, Guid? folderId, CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(Guid? folderId, string fileName, CancellationToken cancellationToken = default);

    void Update(Userfile userFile);
    void Remove(Userfile userFile);
}