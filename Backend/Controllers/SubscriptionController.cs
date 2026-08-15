using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyVault.DTOs.Subscription;
using SkyVault.Services.SubscriptionService;
using System.Security.Claims;

namespace SkyVault.Controllers;

[ApiController]
[Route("api/subscriptions")]
[Authorize]
public class SubscriptionController : ControllerBase
{
    private readonly ISubscriptionService _subscriptionService;

    public SubscriptionController(ISubscriptionService subscriptionService)
    {
        _subscriptionService = subscriptionService;
    }

    [HttpPost]
    public async Task<ActionResult<SubscriptionResponseDto>> Subscribe(
        [FromBody] SubscribeRequestDto request, CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _subscriptionService.SubscribeAsync(userId, request, cancellationToken);

        return Ok(response);
    }

    [HttpGet("me")]
    public async Task<ActionResult<SubscriptionResponseDto>> GetCurrentSubscription(CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _subscriptionService.GetCurrentSubscriptionAsync(userId, cancellationToken);

        if (response is null)
        {
            return NotFound("No active subscription or active grace period was found.");
        }

        return Ok(response);
    }

    [HttpPost("renew")]
    public async Task<ActionResult<SubscriptionResponseDto>> Renew(
        [FromBody] RenewSubscriptionRequestDto request, CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _subscriptionService.RenewAsync(userId, request, cancellationToken);

        return Ok(response);
    }

    [HttpPost("cancel")]
    public async Task<ActionResult<SubscriptionResponseDto>> Cancel(CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _subscriptionService.CancelAsync(userId, cancellationToken);

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

    // Admin only.
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<SubscriptionResponseDto>>> GetAll(CancellationToken cancellationToken)
    {
        var response = await _subscriptionService.GetAllAsync(cancellationToken);

        return Ok(response);
    }

    // Admin only.
    [HttpGet("{subscriptionId:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SubscriptionResponseDto>> GetById(Guid subscriptionId,CancellationToken cancellationToken)
    {
        var response = await _subscriptionService.GetByIdAsync(subscriptionId,cancellationToken);

        return Ok(response);
    }

    // Admin only.
    [HttpGet("user/{userId:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<SubscriptionResponseDto>>> GetByUserId(Guid userId,CancellationToken cancellationToken)
    {
        var response = await _subscriptionService.GetByUserIdAsync(userId,cancellationToken);

        return Ok(response);
    }
}