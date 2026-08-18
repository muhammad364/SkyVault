using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyVault.DTOs.Common.Responses;
using SkyVault.DTOs.RecycleBin.Responses;
using SkyVault.Services.RecycleBinService;

namespace SkyVault.Controllers;

[ApiController]
[Route("api/recycle-bin")]
[Authorize]
public class RecycleBinController : ControllerBase
{
    private readonly IRecycleBinService _recycleBinService;

    public RecycleBinController(IRecycleBinService recycleBinService)
    {
        _recycleBinService = recycleBinService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RecycleBinItemDto>>> GetItems(CancellationToken cancellationToken)
    {
        var response = await _recycleBinService.GetItemsAsync(GetAuthenticatedUserId(), cancellationToken);
        return Ok(response);
    }

    [HttpPost("files/{fileId:guid}/restore")]
    public async Task<ActionResult<MessageResponseDto>> RestoreFile(Guid fileId, CancellationToken cancellationToken)
    {
        var response = await _recycleBinService.RestoreFileAsync(fileId, GetAuthenticatedUserId(), cancellationToken);
        return Ok(response);
    }

    [HttpPost("folders/{folderId:guid}/restore")]
    public async Task<ActionResult<MessageResponseDto>> RestoreFolder(Guid folderId, CancellationToken cancellationToken)
    {
        var response = await _recycleBinService.RestoreFolderAsync(folderId, GetAuthenticatedUserId(), cancellationToken);
        return Ok(response);
    }

    [HttpDelete("files/{fileId:guid}")]
    public async Task<ActionResult<MessageResponseDto>> PermanentlyDeleteFile(Guid fileId, CancellationToken cancellationToken)
    {
        var response = await _recycleBinService.PermanentlyDeleteFileAsync(fileId, GetAuthenticatedUserId(), cancellationToken);
        return Ok(response);
    }

    [HttpDelete("folders/{folderId:guid}")]
    public async Task<ActionResult<MessageResponseDto>> PermanentlyDeleteFolder(Guid folderId, CancellationToken cancellationToken)
    {
        var response = await _recycleBinService.PermanentlyDeleteFolderAsync(folderId, GetAuthenticatedUserId(), cancellationToken);
        return Ok(response);
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
}
