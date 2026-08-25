using SkyVault.Data;

namespace SkyVault.Repository;

public class UnitOfWork : IUnitOfWork
{
    private readonly SkyVaultDbContext _dbContext;

    public UnitOfWork(SkyVaultDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
