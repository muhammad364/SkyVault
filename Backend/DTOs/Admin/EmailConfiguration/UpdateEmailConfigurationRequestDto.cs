namespace SkyVault.DTOs.Admin.EmailConfiguration;

public class UpdateEmailConfigurationRequestDto
{
    public string SmtpHost { get; set; } = null!;

    public int SmtpPort { get; set; }

    public bool UseSsl { get; set; }

    public bool RequiresAuthentication { get; set; }

    public string SenderEmail { get; set; } = null!;

    public string? SenderDisplayName { get; set; }

    public string? Username { get; set; }

    public string? Password { get; set; }
}
