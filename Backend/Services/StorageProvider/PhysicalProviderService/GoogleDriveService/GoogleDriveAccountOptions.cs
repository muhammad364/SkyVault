namespace SkyVault.Services.PhysicalProviderService.GoogleDriveService;

public class GoogleDriveAccountOptions
{
    public string AccountName { get; set; } = null!;

    public string RefreshToken { get; set; } = null!;

    public string RootFolderId { get; set; } = "root";
}
