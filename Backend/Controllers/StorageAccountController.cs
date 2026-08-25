using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyVault.DTOs.StorageAccount;
using SkyVault.Services.StorageAccount;

namespace SkyVault.Controllers;

[ApiController]
[Route("api/storage-accounts")]
[Authorize(Roles = "Admin")]
public class StorageAccountController : ControllerBase
{
    private readonly IStorageAccountService _storageAccountService;

    public StorageAccountController(IStorageAccountService storageAccountService)
    {
        _storageAccountService = storageAccountService;
    }

    [HttpPost]
    public async Task<ActionResult<StorageAccountResponseDto>> Create([FromBody] CreateStorageAccountRequestDto request, CancellationToken cancellationToken)
    {
        var response = await _storageAccountService.CreateAsync(request, cancellationToken);

        return Ok(response);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StorageAccountResponseDto>>> GetAll([FromQuery] bool? isActive, CancellationToken cancellationToken)
    {
        var response = await _storageAccountService.GetAllAsync(isActive, cancellationToken);

        return Ok(response);
    }

    [HttpGet("{storageAccountId:guid}")]
    public async Task<ActionResult<StorageAccountResponseDto>> GetById(Guid storageAccountId, CancellationToken cancellationToken)
    {
        var response = await _storageAccountService.GetByIdAsync(storageAccountId, cancellationToken);

        if (response is null)
        {
            return NotFound("Storage account was not found.");
        }

        return Ok(response);
    }

    [HttpPut("{storageAccountId:guid}")]
    public async Task<ActionResult<StorageAccountResponseDto>> Update(Guid storageAccountId, [FromBody] UpdateStorageAccountRequestDto request, CancellationToken cancellationToken)
    {
        var response = await _storageAccountService.UpdateAsync(storageAccountId, request, cancellationToken);

        return Ok(response);
    }

    [HttpPatch("{storageAccountId:guid}/activate")]
    public async Task<ActionResult<StorageAccountResponseDto>> Activate(Guid storageAccountId, CancellationToken cancellationToken)
    {
        var response = await _storageAccountService.ActivateAsync(storageAccountId, cancellationToken);

        return Ok(response);
    }

    [HttpPatch("{storageAccountId:guid}/deactivate")]
    public async Task<ActionResult<StorageAccountResponseDto>> Deactivate(Guid storageAccountId, CancellationToken cancellationToken)
    {
        var response = await _storageAccountService.DeactivateAsync(storageAccountId, cancellationToken);

        return Ok(response);
    }
}
