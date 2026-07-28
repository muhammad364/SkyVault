using Microsoft.EntityFrameworkCore;
using SkyVault.Data;
using SkyVault.Models;

namespace SkyVault.Repository;

public class ShareLinkRepository : IShareLinkRepository
{
    private readonly SkyVaultDbContext _dbcontext;

    public ShareLinkRepository(SkyVaultDbContext skyVaultDbContext)
    {
        _dbcontext = skyVaultDbContext;
    }

    public async Task AddAsync(Sharelink shareLink, CancellationToken cancellationToken = default)
    {
        await _dbcontext.Sharelinks.AddAsync(shareLink, cancellationToken);
    }

    public async Task<Sharelink?> GetByIdAsync(Guid shareLinkId, CancellationToken cancellationToken = default)
    {
        return await _dbcontext.Sharelinks.FirstOrDefaultAsync(s => s.Sharelinkid == shareLinkId, cancellationToken);
    }

    public async Task<Sharelink?> GetByTokenAsync(string shareToken, CancellationToken cancellationToken = default)
    {
        return await _dbcontext.Sharelinks.FirstOrDefaultAsync(s => s.Sharetoken == shareToken, cancellationToken);
    }

    public async Task<IEnumerable<Sharelink>> GetByFileIdAsync(Guid fileId, CancellationToken cancellationToken = default)
    {
        return await _dbcontext.Sharelinks.Where(s => s.Fileid == fileId).ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Sharelink>> GetByOwnerIdAsync(Guid ownerId, CancellationToken cancellationToken = default)
    {
        return await _dbcontext.Sharelinks.Where(s => s.Ownerid == ownerId).ToListAsync(cancellationToken);
    }

    public void Update(Sharelink shareLink)
    {
        _dbcontext.Sharelinks.Update(shareLink);
    }
}