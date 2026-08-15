using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyVault.Services.Admin;

namespace SkyVault.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
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
}