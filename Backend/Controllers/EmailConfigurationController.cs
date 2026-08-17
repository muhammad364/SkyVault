using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyVault.DTOs.Admin.EmailConfiguration;
using SkyVault.Services.Admin;

namespace SkyVault.Controllers;

[ApiController]
[Route("api/admin/email-configurations")]
[Authorize(Roles = "Admin")]
public class EmailConfigurationController : ControllerBase
{
    private readonly IEmailConfigurationAdminService _service;

    public EmailConfigurationController(IEmailConfigurationAdminService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmailConfigurationResponseDto>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await _service.GetAllAsync(cancellationToken);
        return Ok(result);
    }

    [HttpGet("{emailConfigurationId:guid}")]
    public async Task<ActionResult<EmailConfigurationResponseDto>> GetById(Guid emailConfigurationId, CancellationToken cancellationToken)
    {
        var result = await _service.GetByIdAsync(emailConfigurationId, cancellationToken);
        return result is null ? NotFound("Email configuration was not found.") : Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<EmailConfigurationResponseDto>> Create([FromBody] CreateEmailConfigurationRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _service.CreateAsync(request, cancellationToken);
        return Ok(result);
    }

    [HttpPut("{emailConfigurationId:guid}")]
    public async Task<ActionResult<EmailConfigurationResponseDto>> Update(Guid emailConfigurationId, [FromBody] UpdateEmailConfigurationRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _service.UpdateAsync(emailConfigurationId, request, cancellationToken);
        return Ok(result);
    }

    [HttpPatch("{emailConfigurationId:guid}/activate")]
    public async Task<ActionResult<EmailConfigurationResponseDto>> Activate(Guid emailConfigurationId, CancellationToken cancellationToken)
    {
        var result = await _service.ActivateAsync(emailConfigurationId, cancellationToken);
        return Ok(result);
    }

    [HttpPatch("{emailConfigurationId:guid}/deactivate")]
    public async Task<ActionResult<EmailConfigurationResponseDto>> Deactivate(Guid emailConfigurationId, CancellationToken cancellationToken)
    {
        var result = await _service.DeactivateAsync(emailConfigurationId, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{emailConfigurationId:guid}")]
    public async Task<IActionResult> Delete(Guid emailConfigurationId, CancellationToken cancellationToken)
    {
        await _service.DeleteAsync(emailConfigurationId, cancellationToken);
        return NoContent();
    }
}
