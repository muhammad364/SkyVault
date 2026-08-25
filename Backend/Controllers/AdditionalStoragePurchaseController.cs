using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyVault.DTOs.AdditionalStoragePurchase;
using SkyVault.Services.SubscriptionService;
using System.Security.Claims;

namespace SkyVault.Controllers;

[ApiController]
[Route("api/additional-storage")]
[Authorize]
public class AdditionalStoragePurchaseController : ControllerBase
{
    private readonly IAdditionalStoragePurchaseService _additionalStoragePurchaseService;

    public AdditionalStoragePurchaseController(IAdditionalStoragePurchaseService additionalStoragePurchaseService)
    {
        _additionalStoragePurchaseService = additionalStoragePurchaseService;
    }

    [HttpPost("quote")]
    public async Task<ActionResult<AdditionalStorageQuoteResponseDto>> GetQuote([FromBody] AdditionalStorageQuoteRequestDto request, CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _additionalStoragePurchaseService.GetQuoteAsync(userId, request, cancellationToken);

        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<PurchaseAdditionalStorageResponseDto>> Purchase([FromBody] PurchaseAdditionalStorageRequestDto request, CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _additionalStoragePurchaseService.PurchaseAsync(userId, request, cancellationToken);

        return Ok(response);
    }

    [HttpGet("me")]
    public async Task<ActionResult<IEnumerable<PurchaseAdditionalStorageResponseDto>>> GetMyPurchases(CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _additionalStoragePurchaseService.GetCurrentUserPurchasesAsync(userId, cancellationToken);

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
