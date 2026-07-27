using Microsoft.EntityFrameworkCore;
using SkyVault.Data;
using SkyVault.Models;

namespace SkyVault.Repository;

public class UserFileRepository : IUserFileRepository
{
    private readonly SkyVaultDbContext _dbcontext;

    public UserFileRepository(SkyVaultDbContext skyVaultDbContext)
    {
        _dbcontext = skyVaultDbContext;
    }

    public async Task AddAsync(
        Userfile userFile,
        CancellationToken cancellationToken = default)
    {
        await _dbcontext.Userfiles
            .AddAsync(userFile, cancellationToken);
    }

    public async Task<Userfile?> GetByIdAsync(
        Guid fileId,
        CancellationToken cancellationToken = default)
    {
        return await _dbcontext.Userfiles
            .FirstOrDefaultAsync(
                f => f.Fileid == fileId,
                cancellationToken);
    }

    public async Task<IEnumerable<Userfile>> GetByUserIdAsync(
        Guid ownerId,
        CancellationToken cancellationToken = default)
    {
        return await _dbcontext.Userfiles
            .Where(f => f.Ownerid == ownerId)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(
        Guid folderId,
        string fileName,
        CancellationToken cancellationToken = default)
    {
        return await _dbcontext.Userfiles.AnyAsync(
            f => f.Folderid == folderId &&
                 !f.Isdeleted &&
                 f.Filename == fileName,
            cancellationToken);
    }

    public void Update(Userfile userFile)
    {
        _dbcontext.Userfiles.Update(userFile);
    }

    public void Remove(Userfile userFile)
    {
        _dbcontext.Userfiles.Remove(userFile);
    }
}