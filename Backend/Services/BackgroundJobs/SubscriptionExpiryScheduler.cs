using Microsoft.Extensions.Options;
using SkyVault.Configurations;
using SkyVault.Services.SubscriptionService;

namespace SkyVault.Services.BackgroundJobs;

public class SubscriptionExpiryScheduler : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<SubscriptionExpiryScheduler> _logger;
    private readonly BackgroundTaskSchedulerOptions _options;

    public SubscriptionExpiryScheduler(
        IServiceScopeFactory scopeFactory,
        IOptions<BackgroundTaskSchedulerOptions> options,
        ILogger<SubscriptionExpiryScheduler> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
        _options = options.Value;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var initialDelaySeconds = _options.InitialDelaySeconds > 0
            ? _options.InitialDelaySeconds
            : 15;

        if (initialDelaySeconds > 0)
        {
            await Task.Delay(TimeSpan.FromSeconds(initialDelaySeconds), stoppingToken);
        }

        var intervalMinutes = _options.SubscriptionExpiryCheckIntervalMinutes > 0
            ? _options.SubscriptionExpiryCheckIntervalMinutes
            : 60;

        using var timer = new PeriodicTimer(TimeSpan.FromMinutes(intervalMinutes));

        while (!stoppingToken.IsCancellationRequested)
        {
            await RunExpiryJobAsync(stoppingToken);

            var hasNextTick = await timer.WaitForNextTickAsync(stoppingToken);

            if (!hasNextTick)
            {
                break;
            }
        }
    }

    private async Task RunExpiryJobAsync(CancellationToken cancellationToken)
    {
        try
        {
            using var scope = _scopeFactory.CreateScope();

            var subscriptionService = scope.ServiceProvider.GetRequiredService<ISubscriptionService>();

            var expiredCount = await subscriptionService.ExpireDueSubscriptionsAsync(cancellationToken);

            if (expiredCount > 0)
            {
                _logger.LogInformation("Subscription expiry scheduler processed {ExpiredCount} due subscriptions.", expiredCount);
            }
        }
        catch (OperationCanceledException)
        {
            // Graceful shutdown.
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Subscription expiry scheduler failed.");
        }
    }
}