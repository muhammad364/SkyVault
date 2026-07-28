using Microsoft.EntityFrameworkCore;
using SkyVault.Data;
using SkyVault.Models;

namespace SkyVault.Repository;

public class AuditLogRepository : IAuditLogRepository
{
    private readonly SkyVaultDbContext _dbContext;

    public AuditLogRepository(SkyVaultDbContext skyVaultDbContext)
    {
        _dbContext = skyVaultDbContext;
    }

    public async Task AddAsync(Auditlog log, CancellationToken cancellationToken = default)
    {
        await _dbContext.Auditlogs.AddAsync(log, cancellationToken);
    }
    public async Task<Auditlog?> GetByIdAsync(Guid auditLogId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Auditlogs.FirstOrDefaultAsync(a => a.Auditlogid == auditLogId, cancellationToken);
    }

    public async Task<IEnumerable<Auditlog>> GetAllAsync(Guid administratorId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Auditlogs.Where(a => a.Administratorid == administratorId).ToListAsync(cancellationToken);
    }
}