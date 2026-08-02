using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyVault.DTOs.Folder.Requests;
using SkyVault.DTOs.Folder.Responses;
using SkyVault.DTOs.Common;
using SkyVault.Services.Folder;

namespace SkyVault.Controllers;

[ApiController]
[Route("api/folders")]
[Authorize]
public class FolderController : ControllerBase
{
    private readonly IFolderService _folderService;

    public FolderController(IFolderService folderService)
    {
        _folderService = folderService;
    }

    [HttpPost]
    public async Task<ActionResult<FolderResponseDto>> CreateFolder([FromBody] CreateFolderRequestDto request, CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _folderService.CreateFolderAsync(request, userId, cancellationToken);

        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpGet("root")]
    public async Task<ActionResult<FolderContentsResponseDto>> GetRootFolder( CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _folderService.GetRootFolderAsync(userId, cancellationToken);

        return Ok(response);
    }

    [HttpGet("{folderId:guid}")]
    public async Task<ActionResult<FolderContentsResponseDto>> GetFolder(Guid folderId, CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _folderService.GetFolderAsync(folderId, userId, cancellationToken);

        return Ok(response);
    }

    [HttpPut("{folderId:guid}")]
    public async Task<ActionResult<MessageResponseDto>> RenameFolder(Guid folderId, [FromBody] RenameFolderRequestDto request, CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _folderService.RenameFolderAsync(folderId, request, userId, cancellationToken);

        return Ok(response);
    }

    [HttpPut("{folderId:guid}/move")]
    public async Task<ActionResult<MessageResponseDto>> MoveFolder(Guid folderId, [FromBody] MoveFolderRequestDto request, CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _folderService.MoveFolderAsync(folderId, request, userId, cancellationToken);

        return Ok(response);
    }

    [HttpDelete("{folderId:guid}")]
    public async Task<ActionResult<MessageResponseDto>> DeleteFolder(Guid folderId, CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _folderService.DeleteFolderAsync(folderId, userId, cancellationToken);

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