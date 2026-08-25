using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyVault.DTOs.StorageQuota;
using SkyVault.Services.StorageQuotaService;
using System.Security.Claims;

namespace SkyVault.Controllers;

[ApiController]
[Route("api/storage/quota")]
[Authorize]
public class StorageQuotaController : ControllerBase
{
    private readonly IStorageQuotaService _storageQuotaService;

    public StorageQuotaController(IStorageQuotaService storageQuotaService)
    {
        _storageQuotaService = storageQuotaService;
    }

    [HttpGet]
    public async Task<ActionResult<StorageQuotaResponseDto>> GetMyStorageQuota(CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _storageQuotaService.GetStorageQuotaAsync(userId, cancellationToken);

        return Ok(response);
    }

    private Guid GetAuthenticatedUserId()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        return Guid.Parse(userId);
    }
}
