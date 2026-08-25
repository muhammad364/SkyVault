using Microsoft.EntityFrameworkCore;
using SkyVault.Data;
using SkyVault.Models;

namespace SkyVault.Repository;

public class EmailConfigurationRepository : IEmailConfigurationRepository
{
    private readonly SkyVaultDbContext _dbContext;

    public EmailConfigurationRepository(SkyVaultDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Emailconfiguration>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Emailconfigurations.OrderByDescending(x => x.Updatedat).ToListAsync(cancellationToken);
    }

    public async Task<Emailconfiguration?> GetByIdAsync(Guid emailConfigurationId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Emailconfigurations.FirstOrDefaultAsync(x => x.Emailconfigurationid == emailConfigurationId, cancellationToken);
    }

    public async Task<Emailconfiguration?> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Emailconfigurations.FirstOrDefaultAsync(x => x.Isactive, cancellationToken);
    }

    public async Task AddAsync(Emailconfiguration emailConfiguration, CancellationToken cancellationToken = default)
    {
        await _dbContext.Emailconfigurations.AddAsync(emailConfiguration, cancellationToken);
    }

    public void Update(Emailconfiguration emailConfiguration)
    {
        _dbContext.Emailconfigurations.Update(emailConfiguration);
    }

    public void Remove(Emailconfiguration emailConfiguration)
    {
        _dbContext.Emailconfigurations.Remove(emailConfiguration);
    }
}
