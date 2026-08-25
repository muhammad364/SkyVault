using SkyVault.Services.Authentication.Email;

namespace SkyVault.Services.BackgroundJobs;

public class EmailJobScheduler : IEmailJobScheduler
{
    private readonly IBackgroundTaskQueue _backgroundTaskQueue;

    public EmailJobScheduler(IBackgroundTaskQueue backgroundTaskQueue)
    {
        _backgroundTaskQueue = backgroundTaskQueue;
    }

    public async Task QueueVerificationEmailAsync(string email, string verificationToken, CancellationToken cancellationToken = default)
    {
        await _backgroundTaskQueue.QueueAsync(async (serviceProvider, ct) => { var emailService = serviceProvider.GetRequiredService<IEmailService>();

                await emailService.SendVerificationEmailAsync(email, verificationToken, ct);
            },
            cancellationToken);
    }

    public async Task QueuePasswordResetEmailAsync(string email, string resetToken, CancellationToken cancellationToken = default)
    {
        await _backgroundTaskQueue.QueueAsync(async (serviceProvider, ct) => { var emailService = serviceProvider.GetRequiredService<IEmailService>();

                await emailService.SendPasswordResetEmailAsync(email, resetToken, ct);
            },
            cancellationToken);
    }

    public async Task QueueSubscriptionSuccessEmailAsync(string email, string planName, decimal amount, CancellationToken cancellationToken = default)
    {
        await _backgroundTaskQueue.QueueAsync(async (serviceProvider, ct) => { var emailService = serviceProvider.GetRequiredService<IEmailService>();

                await emailService.SendSubscriptionSuccessEmailAsync(email, planName, amount, ct);
            },
            cancellationToken);
    }

    public async Task QueueSubscriptionCancellationEmailAsync(string email, string planName, CancellationToken cancellationToken = default)
    {
        await _backgroundTaskQueue.QueueAsync(async (serviceProvider, ct) => { var emailService = serviceProvider.GetRequiredService<IEmailService>();

                await emailService.SendSubscriptionCancellationEmailAsync(email, planName, ct);
            },
            cancellationToken);
    }

    public async Task QueueSubscriptionExpiryEmailAsync(string email, string planName, CancellationToken cancellationToken = default)
    {
        await _backgroundTaskQueue.QueueAsync(async (serviceProvider, ct) => { var emailService = serviceProvider.GetRequiredService<IEmailService>();

                await emailService.SendSubscriptionExpiryEmailAsync(email, planName, ct);
            },
            cancellationToken);
    }

    public async Task QueueQuotaWarningEmailAsync(string email, decimal usagePercentage, CancellationToken cancellationToken = default)
    {
        await _backgroundTaskQueue.QueueAsync(async (serviceProvider, ct) => { var emailService = serviceProvider.GetRequiredService<IEmailService>();

                await emailService.SendQuotaWarningEmailAsync(email, usagePercentage, ct);
            },
            cancellationToken);
    }
}
