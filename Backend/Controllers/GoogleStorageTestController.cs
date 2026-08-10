using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyVault.Services.PhysicalProviderService;

[ApiController]
[Route("api/google-drive-test")]
[Authorize(Roles = "Admin")]
public class GoogleDriveTestController : ControllerBase
{
    private readonly IPhysicalStorageProvider _physicalStorageProvider;

    public GoogleDriveTestController(
        IPhysicalStorageProvider physicalStorageProvider)
    {
        _physicalStorageProvider =
            physicalStorageProvider;
    }

    [HttpPost("{storageAccountId:guid}")]
    public async Task<IActionResult> TestUpload(
        Guid storageAccountId,
        CancellationToken cancellationToken)
    {
        await using var content =
            new MemoryStream(
                System.Text.Encoding.UTF8.GetBytes(
                    "SkyVault Google Drive connection test."));

        var providerObjectId =
            await _physicalStorageProvider.UploadAsync(
                storageAccountId,
                content,
                "skyvault-drive-test.txt",
                "text/plain",
                cancellationToken);

        return Ok(
            new
            {
                ProviderObjectId =
                    providerObjectId
            });
    }
}