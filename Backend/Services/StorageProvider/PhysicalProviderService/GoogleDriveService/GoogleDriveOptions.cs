namespace SkyVault.Services.PhysicalProviderService.GoogleDriveService;

public class GoogleDriveOptions
{
    public string ApplicationName { get; set; } = "Skyvault";

    public string ClientId { get; set; } = null!;

    public string ClientSecret { get; set; } = null!;

    public List<GoogleDriveAccountOptions> Accounts { get; set; } = new();
}
