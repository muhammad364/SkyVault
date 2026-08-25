using SkyVault.DTOs.Admin;

namespace SkyVault.Services.AuditLogService;

public interface IAuditLogService
{
    Task RecordAsync(string action, string entityName, Guid entityId, string? details = null, CancellationToken cancellationToken = default);

    Task<AuditLogDto?> GetByIdAsync(Guid auditLogId, CancellationToken cancellationToken = default);

    Task<IEnumerable<AuditLogDto>> GetAllAsync(Guid? administratorId = null, string? action = null, DateTime? performedFrom = null, DateTime? performedTo = null, int skip = 0, int take = 100, CancellationToken cancellationToken = default);
}
