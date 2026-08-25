namespace SkyVault.Services.BackgroundJobs;

public class QueuedBackgroundWorker : BackgroundService
{
    private readonly IBackgroundTaskQueue _backgroundTaskQueue;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<QueuedBackgroundWorker> _logger;

    public QueuedBackgroundWorker(IBackgroundTaskQueue backgroundTaskQueue, IServiceScopeFactory scopeFactory, ILogger<QueuedBackgroundWorker> logger)
    {
        _backgroundTaskQueue = backgroundTaskQueue;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var workItem = await _backgroundTaskQueue.DequeueAsync(stoppingToken);

                using var scope = _scopeFactory.CreateScope();

                await workItem(scope.ServiceProvider, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                // Graceful shutdown.
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "A queued background task failed.");
            }
        }
    }
}
