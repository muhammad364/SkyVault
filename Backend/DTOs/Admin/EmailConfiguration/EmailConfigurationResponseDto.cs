namespace SkyVault.DTOs.Admin.EmailConfiguration;

public class EmailConfigurationResponseDto
{
    public Guid EmailConfigurationId { get; set; }

    public string SmtpHost { get; set; } = null!;

    public int SmtpPort { get; set; }

    public bool UseSsl { get; set; }

    public bool RequiresAuthentication { get; set; }

    public string SenderEmail { get; set; } = null!;

    public string? SenderDisplayName { get; set; }

    public string? Username { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
