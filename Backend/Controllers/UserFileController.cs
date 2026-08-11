using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyVault.DTOs.Common.Responses;
using SkyVault.DTOs.UserFile.Requests;
using SkyVault.DTOs.UserFile.Responses;
using SkyVault.Services.UserFileService;

namespace SkyVault.Controllers;

[ApiController]
[Route("api/files")]
[Authorize]
public class UserFileController : ControllerBase
{
    private readonly IUserFileService _userFileService;

    public UserFileController(IUserFileService userFileService)
    {
        _userFileService = userFileService;
    }


    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<FileResponseDto>> Upload(
        [FromForm] UploadFileRequestDto request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _userFileService.UploadAsync(
            request,
            userId,
            cancellationToken);

        return StatusCode(
            StatusCodes.Status201Created,
            response);
    }



    [HttpGet]
    public async Task<ActionResult<IEnumerable<FileResponseDto>>> GetUserFiles(
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _userFileService.GetUserFilesAsync(
            userId,
            cancellationToken);

        return Ok(response);
    }


    [HttpGet("{fileId:guid}/download")]
    public async Task<IActionResult> Download(
        Guid fileId,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var result = await _userFileService.DownloadAsync(
            fileId,
            userId,
            cancellationToken);

        return File(
            result.Stream,
            result.ContentType,
            result.FileName,
            enableRangeProcessing: true);
    }

 
    [HttpGet("{fileId:guid}/preview")]
    public async Task<IActionResult> Preview(
        Guid fileId,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var result = await _userFileService.PreviewAsync(
            fileId,
            userId,
            cancellationToken);

        return File(
            result.Stream,
            result.ContentType);
    }

    [HttpPut("{fileId:guid}/rename")]
    public async Task<ActionResult<MessageResponseDto>> Rename(
        Guid fileId,
        [FromBody] RenameFileRequestDto request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _userFileService.RenameAsync(
            fileId,
            request,
            userId,
            cancellationToken);

        return Ok(response);
    }


    [HttpPut("{fileId:guid}/move")]
    public async Task<ActionResult<MessageResponseDto>> Move(
        Guid fileId,
        [FromBody] MoveFileRequestDto request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _userFileService.MoveAsync(
            fileId,
            request,
            userId,
            cancellationToken);

        return Ok(response);
    }


    [HttpPut("{fileId:guid}/replace")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<MessageResponseDto>> Replace(
        Guid fileId,
        [FromForm] ReplaceFileRequestDto request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _userFileService.ReplaceAsync(
            fileId,
            request,
            userId,
            cancellationToken);

        return Ok(response);
    }

    [HttpPost("copy")]
    public async Task<ActionResult<IEnumerable<FileResponseDto>>> Copy(
        [FromBody] CopyFileRequestDto request,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _userFileService.CopyAsync(
            request,
            userId,
            cancellationToken);

        return Ok(response);
    }

    [HttpDelete("{fileId:guid}")]
    public async Task<ActionResult<MessageResponseDto>> Delete(
        Guid fileId,
        CancellationToken cancellationToken)
    {
        var userId = GetAuthenticatedUserId();

        var response = await _userFileService.DeleteAsync(
            fileId,
            userId,
            cancellationToken);

        return Ok(response);
    }

    private Guid GetAuthenticatedUserId()
    {
        var userIdClaim =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException(
                "Authenticated user information is missing or invalid.");
        }

        return userId;
    }
}