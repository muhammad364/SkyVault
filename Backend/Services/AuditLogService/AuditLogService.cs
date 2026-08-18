using System.Security.Claims;
using AutoMapper;
using SkyVault.DTOs.Admin;
using SkyVault.Models;
using SkyVault.Repository;

namespace SkyVault.Services.AuditLogService;

public class AuditLogService : IAuditLogService
{
    private readonly IAuditLogRepository _auditLogRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IMapper _mapper;

    public AuditLogService(
        IAuditLogRepository auditLogRepository,
        IUnitOfWork unitOfWork,
        IHttpContextAccessor httpContextAccessor,
        IMapper mapper)
    {
        _auditLogRepository = auditLogRepository;
        _unitOfWork = unitOfWork;
        _httpContextAccessor = httpContextAccessor;
        _mapper = mapper;
    }

    public async Task RecordAsync(
        string action,
        string entityName,
        Guid entityId,
        string? details = null,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(action))
        {
            throw new ArgumentException("Audit action is required.", nameof(action));
        }

        if (string.IsNullOrWhiteSpace(entityName))
        {
            throw new ArgumentException("Audit entity name is required.", nameof(entityName));
        }

        var principal = _httpContextAccessor.HttpContext?.User;
        var administratorIdValue = principal?.FindFirstValue(ClaimTypes.NameIdentifier);

        if (principal?.IsInRole("Admin") != true ||
            !Guid.TryParse(administratorIdValue, out var administratorId))
        {
            throw new UnauthorizedAccessException("An authenticated administrator is required to create an audit log.");
        }

        var auditLog = new Auditlog
        {
            Auditlogid = Guid.NewGuid(),
            Administratorid = administratorId,
            Action = action.Trim(),
            Entityname = entityName.Trim(),
            Entityid = entityId,
            Details = string.IsNullOrWhiteSpace(details) ? null : details.Trim(),
            Performedat = DateTime.UtcNow
        };

        await _auditLogRepository.AddAsync(auditLog, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<AuditLogDto?> GetByIdAsync(
        Guid auditLogId,
        CancellationToken cancellationToken = default)
    {
        var auditLog = await _auditLogRepository.GetByIdAsync(auditLogId, cancellationToken);
        return auditLog is null ? null : _mapper.Map<AuditLogDto>(auditLog);
    }

    public async Task<IEnumerable<AuditLogDto>> GetAllAsync(
        Guid? administratorId = null,
        string? action = null,
        DateTime? performedFrom = null,
        DateTime? performedTo = null,
        int skip = 0,
        int take = 100,
        CancellationToken cancellationToken = default)
    {
        var auditLogs = await _auditLogRepository.GetAllAsync(
            administratorId,
            action,
            performedFrom,
            performedTo,
            skip,
            take,
            cancellationToken);

        return _mapper.Map<IEnumerable<AuditLogDto>>(auditLogs);
    }
}
