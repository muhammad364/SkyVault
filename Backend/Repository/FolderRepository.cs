using Microsoft.EntityFrameworkCore;
using SkyVault.Data;
using SkyVault.Models;

namespace SkyVault.Repository;

public class FolderRepository : IFolderRepository
{
    private readonly SkyVaultDbContext _dbcontext;

    public FolderRepository(SkyVaultDbContext skyVaultDbContext)
    {
        _dbcontext = skyVaultDbContext;
    }

    public async Task AddAsync(Folder folder, CancellationToken cancellationToken = default)
    {
        await _dbcontext.Folders.AddAsync(folder, cancellationToken);
    }

    public async Task<Folder?> GetByIdAsync(Guid folderId, CancellationToken cancellationToken = default)
    {
        return await _dbcontext.Folders.FirstOrDefaultAsync(f => f.Folderid == folderId, cancellationToken);
    }

    public async Task<IEnumerable<Folder>> GetByUserIdAsync(Guid ownerId, CancellationToken cancellationToken = default)
    {
        return await _dbcontext.Folders.Where(f => f.Ownerid == ownerId).ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(Guid ownerId, Guid? parentFolderId, string folderName, CancellationToken cancellationToken = default)
    {
        return await _dbcontext.Folders.AnyAsync(f => f.Ownerid == ownerId && f.Parentfolderid == parentFolderId && f.Name == folderName && !f.Isdeleted, cancellationToken);
    }

    public void Update(Folder folder)
    {
        _dbcontext.Folders.Update(folder);
    }

    public void Remove(Folder folder)
    {
        _dbcontext.Folders.Remove(folder);
    }
}