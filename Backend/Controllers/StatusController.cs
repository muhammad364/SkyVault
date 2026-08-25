using Microsoft.AspNetCore.Mvc;

namespace SkyVault.Controllers;

[ApiController]
[Route("api/status")]
public class StatusController : ControllerBase
{
    [HttpGet]
    public IActionResult GetStatus()
    {
        return Ok(new
        {
            Status = "Running",
            Message = "SkyVault API is running successfully.",
            Timestamp = DateTime.UtcNow
        });
    }
}
