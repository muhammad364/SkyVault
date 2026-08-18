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
        return await _dbContext.Auditlogs
            .AsNoTracking()
            .Include(a => a.Administrator)
            .FirstOrDefaultAsync(a => a.Auditlogid == auditLogId, cancellationToken);
    }

    public Task<IEnumerable<Auditlog>> GetAllAsync(
        Guid administratorId,
        CancellationToken cancellationToken = default)
    {
        return GetAllAsync(
            administratorId,
            action: null,
            performedFrom: null,
            performedTo: null,
            skip: 0,
            take: 100,
            cancellationToken);
    }

    public async Task<IEnumerable<Auditlog>> GetAllAsync(
        Guid? administratorId = null,
        string? action = null,
        DateTime? performedFrom = null,
        DateTime? performedTo = null,
        int skip = 0,
        int take = 100,
        CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Auditlogs
            .AsNoTracking()
            .Include(a => a.Administrator)
            .AsQueryable();

        if (administratorId.HasValue)
        {
            query = query.Where(a => a.Administratorid == administratorId.Value);
        }

        if (!string.IsNullOrWhiteSpace(action))
        {
            query = query.Where(a => a.Action == action);
        }

        if (performedFrom.HasValue)
        {
            query = query.Where(a => a.Performedat >= performedFrom.Value);
        }

        if (performedTo.HasValue)
        {
            query = query.Where(a => a.Performedat <= performedTo.Value);
        }

        return await query
            .OrderByDescending(a => a.Performedat)
            .Skip(Math.Max(skip, 0))
            .Take(Math.Clamp(take, 1, 500))
            .ToListAsync(cancellationToken);
    }
}
