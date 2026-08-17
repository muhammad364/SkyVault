namespace SkyVault.Services.BackgroundJobs;

public interface IEmailJobScheduler
{
    Task QueueVerificationEmailAsync(string email, string verificationToken, CancellationToken cancellationToken = default);

    Task QueuePasswordResetEmailAsync(string email, string resetToken, CancellationToken cancellationToken = default);

    Task QueueSubscriptionSuccessEmailAsync(
        string email,
        string planName,
        decimal amount,
        CancellationToken cancellationToken = default);

    Task QueueSubscriptionCancellationEmailAsync(
        string email,
        string planName,
        CancellationToken cancellationToken = default);

    Task QueueSubscriptionExpiryEmailAsync(
        string email,
        string planName,
        CancellationToken cancellationToken = default);

    Task QueueQuotaWarningEmailAsync(
        string email,
        decimal usagePercentage,
        CancellationToken cancellationToken = default);
}