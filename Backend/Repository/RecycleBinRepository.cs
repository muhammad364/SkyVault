using Microsoft.EntityFrameworkCore;
using SkyVault.Data;
using SkyVault.Models;

namespace SkyVault.Repository;

public class RecycleBinRepository : IRecycleBinRepository
{
    private readonly SkyVaultDbContext _dbContext;

    public RecycleBinRepository(SkyVaultDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Folder>> GetDeletedFoldersByOwnerAsync(Guid ownerId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Folders.Where(folder => folder.Ownerid == ownerId && folder.Isdeleted).ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Userfile>> GetDeletedFilesByOwnerAsync(Guid ownerId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Userfiles.Where(file => file.Ownerid == ownerId && file.Isdeleted).ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Folder>> GetExpiredDeletedFoldersAsync(DateTime expiredBefore, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Folders.Where(folder => folder.Isdeleted && folder.Deletedat.HasValue && folder.Deletedat.Value <= expiredBefore).ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Userfile>> GetExpiredDeletedFilesAsync(DateTime expiredBefore, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Userfiles.Where(file => file.Isdeleted && file.Deletedat.HasValue && file.Deletedat.Value <= expiredBefore).ToListAsync(cancellationToken);
    }
}
