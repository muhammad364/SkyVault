using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyVault.DTOs.StorageProvider;
using SkyVault.Services.StorageProvider;

namespace SkyVault.Controllers;

[ApiController]
[Route("api/storage-providers")]
[Authorize(Roles = "Admin")]
public class StorageProviderController : ControllerBase
{
    private readonly IStorageProviderService _storageProviderService;

    public StorageProviderController(IStorageProviderService storageProviderService)
    {
        _storageProviderService = storageProviderService;
    }

    [HttpPost]
    public async Task<ActionResult<StorageProviderResponseDto>> Create([FromBody] CreateStorageProviderRequestDto request,CancellationToken cancellationToken)
    {
        var response =await _storageProviderService.CreateAsync(request, cancellationToken);

        return Ok(response);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StorageProviderResponseDto>>> GetAll(CancellationToken cancellationToken)
    {
        var response = await _storageProviderService.GetAllAsync(cancellationToken);

        return Ok(response);
    }

    [HttpGet("{providerId:guid}")]
    public async Task<ActionResult<StorageProviderResponseDto>> GetById(Guid providerId, CancellationToken cancellationToken)
    {
        var response = await _storageProviderService.GetByIdAsync(providerId, cancellationToken);

        if (response is null)
        {
            return NotFound("Storage provider was not found.");
        }

        return Ok(response);
    }

    [HttpPut("{providerId:guid}")]
    public async Task<ActionResult<StorageProviderResponseDto>> Update(Guid providerId, [FromBody] UpdateStorageProviderRequestDto request, CancellationToken cancellationToken)
    {
        var response = await _storageProviderService.UpdateAsync(providerId, request, cancellationToken);

        return Ok(response);
    }

    [HttpPatch("{providerId:guid}/activate")]
    public async Task<ActionResult<StorageProviderResponseDto>> Activate(Guid providerId, CancellationToken cancellationToken)
    {
        var response = await _storageProviderService.ActivateAsync(providerId, cancellationToken);

        return Ok(response);
    }

    [HttpPatch("{providerId:guid}/deactivate")]
    public async Task<ActionResult<StorageProviderResponseDto>> Deactivate(Guid providerId, CancellationToken cancellationToken)
    {
        var response = await _storageProviderService.DeactivateAsync(providerId, cancellationToken);

        return Ok(response);
    }
}