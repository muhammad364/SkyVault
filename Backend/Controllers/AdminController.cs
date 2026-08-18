using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyVault.Services.Admin;
using SkyVault.Services.AuditLogService;

namespace SkyVault.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    private readonly IAuditLogService _auditLogService;

    public AdminController(IAdminService adminService, IAuditLogService auditLogService)
    {
        _adminService = adminService;
        _auditLogService = auditLogService;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers(CancellationToken cancellationToken)
    {
        var users = await _adminService.GetAllUsersAsync(cancellationToken);

        return Ok(users);
    }

    [HttpGet("users/{userId:guid}")]
    public async Task<IActionResult> GetUserById(Guid userId,CancellationToken cancellationToken)
    {
        var user = await _adminService.GetUserByIdAsync(userId, cancellationToken);

        return Ok(user);
    }

    [HttpPut("users/{userId:guid}/activate")]
    public async Task<IActionResult> ActivateUser(Guid userId,CancellationToken cancellationToken)
    {
        var user = await _adminService.ActivateUserAsync(userId, cancellationToken);

        return Ok(user);
    }

    [HttpPut("users/{userId:guid}/deactivate")]
    public async Task<IActionResult> DeactivateUser(Guid userId,CancellationToken cancellationToken)
    {
        var user = await _adminService.DeactivateUserAsync(userId, cancellationToken);

        return Ok(user);
    }

    [HttpGet("storage/overview")]
    public async Task<IActionResult> GetStorageOverview(CancellationToken cancellationToken)
    {
        var overview = await _adminService.GetStorageOverviewAsync(cancellationToken);

        return Ok(overview);
    }

    [HttpGet("users/{userId:guid}/storage")]
    public async Task<IActionResult> GetUserStorageAllocation(
        Guid userId,
        CancellationToken cancellationToken)
    {
        var allocation = await _adminService.GetUserStorageAllocationAsync(userId, cancellationToken);

        return Ok(allocation);
    }

    [HttpGet("statistics")]
    public async Task<IActionResult> GetSystemStatistics(CancellationToken cancellationToken)
    {
        var statistics = await _adminService.GetSystemStatisticsAsync(cancellationToken);

        return Ok(statistics);
    }

    [HttpGet("audit-logs")]
    public async Task<IActionResult> GetAuditLogs(
        [FromQuery] Guid? administratorId,
        [FromQuery] string? action,
        [FromQuery] DateTime? performedFrom,
        [FromQuery] DateTime? performedTo,
        [FromQuery] int skip = 0,
        [FromQuery] int take = 100,
        CancellationToken cancellationToken = default)
    {
        var auditLogs = await _auditLogService.GetAllAsync(
            administratorId,
            action,
            performedFrom,
            performedTo,
            skip,
            take,
            cancellationToken);

        return Ok(auditLogs);
    }

    [HttpGet("audit-logs/{auditLogId:guid}")]
    public async Task<IActionResult> GetAuditLog(
        Guid auditLogId,
        CancellationToken cancellationToken)
    {
        var auditLog = await _auditLogService.GetByIdAsync(auditLogId, cancellationToken);
        return auditLog is null ? NotFound("Audit log was not found.") : Ok(auditLog);
    }
}
