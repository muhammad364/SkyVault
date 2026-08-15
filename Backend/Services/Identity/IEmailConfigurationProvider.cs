namespace SkyVault.Services.Identity;

public interface IEmailConfigurationProvider
{
    Task<EmailConfigurationSettings?> GetActiveSettingsAsync(CancellationToken cancellationToken = default);
}

public class EmailConfigurationSettings
{
    public string SmtpHost { get; set; } = string.Empty;

    public int SmtpPort { get; set; }

    public bool UseSsl { get; set; }

    public bool RequiresAuthentication { get; set; }

    public string SenderEmail { get; set; } = string.Empty;

    public string? SenderDisplayName { get; set; }

    public string? Username { get; set; }

    public string? Password { get; set; }
}
