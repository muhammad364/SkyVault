using SkyVault.Models;

namespace SkyVault.Repository;

public interface IAuditLogRepository
{
    Task AddAsync(Auditlog auditLog, CancellationToken cancellationToken = default);

    Task<Auditlog?> GetByIdAsync(Guid auditLogId, CancellationToken cancellationToken = default);

    Task<IEnumerable<Auditlog>> GetAllAsync(
        Guid administratorId,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<Auditlog>> GetAllAsync(
        Guid? administratorId = null,
        string? action = null,
        DateTime? performedFrom = null,
        DateTime? performedTo = null,
        int skip = 0,
        int take = 100,
        CancellationToken cancellationToken = default);
        
}
