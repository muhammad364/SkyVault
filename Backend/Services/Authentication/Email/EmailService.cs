using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using SkyVault.Services.Identity;

namespace SkyVault.Services.Authentication.Email;

public class EmailService : IEmailService
{
    private readonly IEmailConfigurationProvider _configurationProvider;
    private readonly ILogger<EmailService> _logger;
    private readonly string _baseUrl;

    public EmailService(
        IEmailConfigurationProvider configurationProvider,
        ILogger<EmailService> logger,
        IConfiguration configuration)
    {
        _configurationProvider = configurationProvider;
        _logger = logger;
        _baseUrl = configuration["AppSettings:BaseUrl"] ?? "http://localhost:5122";
    }

    public async Task SendVerificationEmailAsync(string email, string verificationToken, CancellationToken cancellationToken = default)
    {
        var link = $"{GetBaseUrl()}/api/auth/verify-email?token={Uri.EscapeDataString(verificationToken)}";
        await SendAsync(
            email,
            "Verify your SkyVault account",
            $"<p>Welcome to SkyVault!</p><p>Please verify your email by clicking the button below.</p>" +
            $"<p><a href=\"{link}\">Verify email</a></p>" +
            $"<p>If the link does not work, use this token: {verificationToken}</p>",
            cancellationToken);
    }

    public async Task SendPasswordResetEmailAsync(string email, string resetToken, CancellationToken cancellationToken = default)
    {
        var link = $"{GetBaseUrl()}/api/auth/reset-password?token={Uri.EscapeDataString(resetToken)}";
        await SendAsync(
            email,
            "Reset your SkyVault password",
            $"<p>You requested a password reset.</p><p>Click the link below to create a new password.</p>" +
            $"<p><a href=\"{link}\">Reset password</a></p>" +
            $"<p>If the link does not work, use this token: {resetToken}</p>",
            cancellationToken);
    }

    public async Task SendSubscriptionSuccessEmailAsync(
        string email,
        string planName,
        decimal amount,
        CancellationToken cancellationToken = default)
    {
        await SendAsync(
            email,
            "Your SkyVault subscription is active",
            $"<p>Thank you for subscribing to SkyVault.</p><p>Your plan: {planName}</p><p>Amount: ${amount:F2}</p><p>Your storage access is now active.</p>",
            cancellationToken);
    }

    public async Task SendSubscriptionCancellationEmailAsync(
        string email,
        string planName,
        CancellationToken cancellationToken = default)
    {
        await SendAsync(
            email,
            "Your SkyVault subscription has been cancelled",
            $"<p>Your {planName} subscription has been successfully cancelled.</p><p>You can still access your files during the grace period, and you may renew at any time.</p>",
            cancellationToken);
    }

    public async Task SendSubscriptionExpiryEmailAsync(
        string email,
        string planName,
        CancellationToken cancellationToken = default)
    {
        await SendAsync(
            email,
            "Your SkyVault subscription has expired",
            $"<p>Your {planName} subscription has expired.</p><p>Your storage access may be reduced or paused until you renew the plan or purchase additional storage.</p><p>Please visit SkyVault to review your options.</p>",
            cancellationToken);
    }

    public async Task SendQuotaWarningEmailAsync(
        string email,
        decimal usagePercentage,
        CancellationToken cancellationToken = default)
    {
        await SendAsync(
            email,
            "SkyVault storage quota alert",
            $"<p>Your storage usage has reached {usagePercentage:F2}%.</p><p>Please consider purchasing additional storage or upgrading your plan to avoid service disruption.</p>",
            cancellationToken);
    }

    private string GetBaseUrl()
    {
        return _baseUrl.TrimEnd('/');
    }

    private async Task SendAsync(string email, string subject, string htmlBody, CancellationToken cancellationToken)
    {
        var config = await _configurationProvider.GetActiveSettingsAsync(cancellationToken);

        if (config is null)
        {
            _logger.LogWarning("Email not sent to {Email}. No active SMTP configuration exists.", email);
            return;
        }

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(config.SenderDisplayName ?? "SkyVault", config.SenderEmail));
        message.To.Add(MailboxAddress.Parse(email));
        message.Subject = subject;
        message.Body = new TextPart(MimeKit.Text.TextFormat.Html)
        {
            Text = htmlBody
        };

        try
        {
            using var client = new SmtpClient();
            await client.ConnectAsync(
                config.SmtpHost,
                config.SmtpPort,
                config.UseSsl ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTlsWhenAvailable,
                cancellationToken);

            if (config.RequiresAuthentication)
            {
                if (string.IsNullOrWhiteSpace(config.Username) || string.IsNullOrWhiteSpace(config.Password))
                {
                    throw new InvalidOperationException("SMTP authentication is enabled but username/password is missing.");
                }

                await client.AuthenticateAsync(config.Username, config.Password, cancellationToken);
            }

            await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);
            _logger.LogInformation("Email sent successfully to {Email} with subject {Subject}.", email, subject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email} with subject {Subject}.", email, subject);
        }
    }
}