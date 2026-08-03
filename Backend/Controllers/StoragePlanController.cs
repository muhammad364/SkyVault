using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyVault.DTOs.StoragePlan.Requests;
using SkyVault.DTOs.StoragePlan.Responses;
using SkyVault.Services.StorageService;

namespace SkyVault.Controllers;

[ApiController]
[Route("api/storage-plans")]
[Authorize]

public class StoragePlanController : ControllerBase
{
    private readonly IStoragePlanService _storagePlanService;

    public StoragePlanController(IStoragePlanService planService)
    {
        _storagePlanService = planService;
    }

    [HttpGet]
    public async Task <ActionResult<IEnumerable<StoragePlanResponseDto>>> GetAllPlans(CancellationToken cancellationToken = default)
    {
        var plans = await _storagePlanService.GetAllAsync(true, cancellationToken);

        return Ok(plans);
    }

    [HttpGet("{storagePlanId:guid}")]
    public async Task<ActionResult<StoragePlanResponseDto>> GetPlanById (Guid storagePlanId, CancellationToken cancellationToken = default)
    {
        var plan = await _storagePlanService.GetByIdAsync(storagePlanId, cancellationToken);

        return Ok(plan);
    }

    // Admin only.
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<StoragePlanResponseDto>> Create([FromBody] CreateStoragePlanRequestDto request, CancellationToken cancellationToken)
    {
        var createdStoragePlan = await _storagePlanService.CreateAsync(request, cancellationToken);

        return CreatedAtAction(nameof(GetPlanById), new { storagePlanId = createdStoragePlan.StoragePlanId }, createdStoragePlan);
    }

    // Admin only.
    [HttpPut("{storagePlanId:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<StoragePlanResponseDto>> Update(Guid storagePlanId, [FromBody] UpdateStoragePlanRequestDto request, CancellationToken cancellationToken)
    {
        var updatedStoragePlan = await _storagePlanService.UpdateAsync(storagePlanId, request, cancellationToken);

        return Ok(updatedStoragePlan);
    }
}