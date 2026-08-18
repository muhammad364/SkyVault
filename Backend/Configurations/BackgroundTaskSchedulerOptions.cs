namespace SkyVault.Configurations;

public class BackgroundTaskSchedulerOptions
{
    public const string SectionName = "BackgroundTaskScheduler";

    public int QueueCapacity { get; set; } = 100;

    public int SubscriptionExpiryCheckIntervalMinutes { get; set; } = 60;

    public int RecycleBinCleanupIntervalHours { get; set; } = 24;

    public int InitialDelaySeconds { get; set; } = 15;
}
