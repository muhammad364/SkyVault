using Microsoft.Extensions.Options;
using SkyVault.Configurations;
using SkyVault.Services.RecycleBinService;

namespace SkyVault.Services.BackgroundJobs;

public class RecycleBinCleanupScheduler : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<RecycleBinCleanupScheduler> _logger;
    private readonly BackgroundTaskSchedulerOptions _options;

    public RecycleBinCleanupScheduler(IServiceScopeFactory scopeFactory, IOptions<BackgroundTaskSchedulerOptions> options, ILogger<RecycleBinCleanupScheduler> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
        _options = options.Value;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Recycle Bin cleanup scheduler started.");

        try
        {
            var initialDelaySeconds = _options.InitialDelaySeconds > 0 ? _options.InitialDelaySeconds : 15;
            await Task.Delay(TimeSpan.FromSeconds(initialDelaySeconds), stoppingToken);

            var intervalHours = _options.RecycleBinCleanupIntervalHours > 0 ? _options.RecycleBinCleanupIntervalHours : 24;
            using var timer = new PeriodicTimer(TimeSpan.FromHours(intervalHours));

            while (!stoppingToken.IsCancellationRequested)
            {
                await RunCleanupJobAsync(stoppingToken);

                if (!await timer.WaitForNextTickAsync(stoppingToken))
                {
                    break;
                }
            }
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
        {
        }
        finally
        {
            _logger.LogInformation("Recycle Bin cleanup scheduler stopped.");
        }
    }

    private async Task RunCleanupJobAsync(CancellationToken cancellationToken)
    {
        try
        {
            using var scope = _scopeFactory.CreateScope();
            var recycleBinService = scope.ServiceProvider.GetRequiredService<IRecycleBinService>();
            var deletedCount = await recycleBinService.DeleteExpiredItemsAsync(cancellationToken);

            _logger.LogInformation("Recycle Bin cleanup scheduler completed. Permanently deleted {DeletedCount} expired items.", deletedCount);
        }
        catch (OperationCanceledException)
        {
            // Graceful shutdown.
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Recycle Bin cleanup scheduler failed.");
        }
    }
}
