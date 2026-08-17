using Microsoft.AspNetCore.DataProtection;
using SkyVault.Repository;

namespace SkyVault.Services.Identity;

public class EmailConfigurationProvider : IEmailConfigurationProvider
{
    private readonly IEmailConfigurationRepository _emailConfigurationRepository;
    private readonly IDataProtector _dataProtector;

    public EmailConfigurationProvider(
        IEmailConfigurationRepository emailConfigurationRepository,
        IDataProtectionProvider dataProtectionProvider)
    {
        _emailConfigurationRepository = emailConfigurationRepository;
        _dataProtector = dataProtectionProvider.CreateProtector("SkyVault.EmailConfiguration");
    }

    public async Task<EmailConfigurationSettings?> GetActiveSettingsAsync(CancellationToken cancellationToken = default)
    {
        var entity = await _emailConfigurationRepository.GetActiveAsync(cancellationToken);

        if (entity is null)
        {
            return null;
        }

        return new EmailConfigurationSettings
        {
            SmtpHost = entity.Smtphost,
            SmtpPort = entity.Smtpport,
            UseSsl = entity.Usessl,
            RequiresAuthentication = entity.Requiresauthentication,
            SenderEmail = entity.Senderemail,
            SenderDisplayName = entity.Senderdisplayname,
            Username = entity.Username,
            Password = DecodePassword(entity.Encryptedpassword)
        };
    }

    private string? DecodePassword(string? encryptedPassword)
    {
        if (string.IsNullOrWhiteSpace(encryptedPassword))
        {
            return null;
        }

        try
        {
            return _dataProtector.Unprotect(encryptedPassword);
        }
        catch
        {
            return encryptedPassword;
        }
    }
}
