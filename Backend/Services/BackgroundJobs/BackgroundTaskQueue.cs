using System.Threading.Channels;
using Microsoft.Extensions.Options;
using SkyVault.Configurations;

namespace SkyVault.Services.BackgroundJobs;

public class BackgroundTaskQueue : IBackgroundTaskQueue
{
    private readonly Channel<Func<IServiceProvider, CancellationToken, Task>> _queue;

    public BackgroundTaskQueue(IOptions<BackgroundTaskSchedulerOptions> options)
    {
        var queueCapacity = options.Value.QueueCapacity;

        if (queueCapacity <= 0)
        {
            queueCapacity = 100;
        }

        var channelOptions = new BoundedChannelOptions(queueCapacity)
        {
            FullMode = BoundedChannelFullMode.Wait,
            SingleReader = true,
            SingleWriter = false
        };

        _queue = Channel.CreateBounded<Func<IServiceProvider, CancellationToken, Task>>(channelOptions);
    }

    public async ValueTask QueueAsync(Func<IServiceProvider, CancellationToken, Task> workItem, CancellationToken cancellationToken = default)
    {
        if (workItem is null)
        {
            throw new ArgumentNullException(nameof(workItem));
        }

        await _queue.Writer.WriteAsync(workItem, cancellationToken);
    }

    public async ValueTask<Func<IServiceProvider, CancellationToken, Task>> DequeueAsync(CancellationToken cancellationToken)
    {
        return await _queue.Reader.ReadAsync(cancellationToken);
    }
}
