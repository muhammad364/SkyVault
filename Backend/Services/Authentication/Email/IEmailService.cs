namespace SkyVault.Services.Authentication.Email;

public interface IEmailService
{
    Task SendVerificationEmailAsync(string email, string verificationToken, CancellationToken cancellationToken = default);

    Task SendPasswordResetEmailAsync(string email, string resetToken, CancellationToken cancellationToken = default);

    Task SendSubscriptionSuccessEmailAsync(
        string email,
        string planName,
        decimal amount,
        CancellationToken cancellationToken = default);

    Task SendSubscriptionCancellationEmailAsync(
        string email,
        string planName,
        CancellationToken cancellationToken = default);

    Task SendSubscriptionExpiryEmailAsync(
        string email,
        string planName,
        CancellationToken cancellationToken = default);

    Task SendQuotaWarningEmailAsync(
        string email,
        decimal usagePercentage,
        CancellationToken cancellationToken = default);
}