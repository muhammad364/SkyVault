using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyVault.DTOs.Common.Responses;
using SkyVault.DTOs.ShareLink.Requests;
using SkyVault.DTOs.ShareLink.Responses;
using SkyVault.Services.ShareLinkService;

namespace SkyVault.Controllers;

[ApiController]
public class ShareLinkController : ControllerBase
{
    private readonly IShareLinkService _shareLinkService;

    public ShareLinkController(IShareLinkService shareLinkService)
    {
        _shareLinkService = shareLinkService;
    }

    [Authorize]
    [HttpPost("api/share-links")]
    public async Task<ActionResult<GenerateShareLinkResponseDto>> GenerateShareLink([FromBody] GenerateShareLinkRequestDto request, CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var shareLink = await _shareLinkService.GenerateAsync(request, userId, cancellationToken);

        var response = ToGenerateShareLinkResponse(shareLink, forceActiveLink: true);

        return StatusCode(StatusCodes.Status201Created, response);
    }

    [Authorize]
    [HttpGet("api/share-links")]
    public async Task<ActionResult<IEnumerable<GenerateShareLinkResponseDto>>> GetOwnShareLinks(CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var shareLinks = await _shareLinkService.GetOwnerLinksAsync(userId, cancellationToken);

        var response = shareLinks.Select(shareLink => ToGenerateShareLinkResponse(shareLink)).ToList();

        return Ok(response);
    }

    [Authorize]
    [HttpPatch("api/share-links/{shareLinkId:guid}/revoke")]
    public async Task<ActionResult<MessageResponseDto>> RevokeShareLink(Guid shareLinkId, CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _shareLinkService.RevokeAsync(shareLinkId, userId, cancellationToken);

        return Ok(response);
    }

    [AllowAnonymous]
    [HttpGet("api/share/{shareToken}")]
    public async Task<IActionResult> PreviewSharedFile(string shareToken, CancellationToken cancellationToken)
    {
        var result = await _shareLinkService.PreviewByTokenAsync(shareToken, cancellationToken);

        return File(result.Stream, result.ContentType);
    }

    [AllowAnonymous]
    [HttpGet("api/share/{shareToken}/download")]
    public async Task<IActionResult> DownloadSharedFile(string shareToken, CancellationToken cancellationToken)
    {
        var result = await _shareLinkService.DownloadByTokenAsync(shareToken, cancellationToken);

        return File(result.Stream, result.ContentType, result.FileName, enableRangeProcessing: true);
    }

    private Guid GetAuthenticatedUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Authenticated user information is missing or invalid.");
        }

        return userId;
    }

    private GenerateShareLinkResponseDto ToGenerateShareLinkResponse(ShareLinkDto shareLink, bool forceActiveLink = false)
    {
        return new GenerateShareLinkResponseDto
        {
            ShareLinkId = shareLink.ShareLinkId,
            FileId = shareLink.FileId,
            ShareUrl = BuildShareUrl(shareLink.ShareToken),
            ExpiresAt = shareLink.ExpiresAt,
            IsRevoked = forceActiveLink ? false : shareLink.IsRevoked,
            CreatedAt = shareLink.CreatedAt
        };
    }

    private string BuildShareUrl(string shareToken)
    {
        if (Request.Host.HasValue)
        {
            return $"{Request.Scheme}://{Request.Host}/api/share/{shareToken}";
        }

        return $"/api/share/{shareToken}";
    }
}
