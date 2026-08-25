using SkyVault.DTOs.StorageQuota;
using SkyVault.Models;
using SkyVault.Repository;
using SkyVault.Services.BackgroundJobs;

namespace SkyVault.Services.StorageQuotaService;

public class StorageQuotaService : IStorageQuotaService
{
    private const short ActiveSubscriptionStatus = 0;
    private const short ActiveAdditionalStorageStatus = 0;

    private const long BytesPerGigabyte = 1024L * 1024L * 1024L;

    private readonly IUserRepository _userRepository;
    private readonly IUserFileRepository _userFileRepository;
    private readonly ISubscriptionRepository _subscriptionRepository;
    private readonly IStoragePlanRepository _storagePlanRepository;
    private readonly IAdditionalStoragePurchaseRepository _additionalStoragePurchaseRepository;
    private readonly IEmailJobScheduler _emailJobScheduler;

    public StorageQuotaService(IUserRepository userRepository, IUserFileRepository userFileRepository, ISubscriptionRepository subscriptionRepository, IStoragePlanRepository storagePlanRepository, IAdditionalStoragePurchaseRepository additionalStoragePurchaseRepository, IEmailJobScheduler emailJobScheduler)
    {
        _userRepository = userRepository;
        _userFileRepository = userFileRepository;
        _subscriptionRepository = subscriptionRepository;
        _storagePlanRepository = storagePlanRepository;
        _additionalStoragePurchaseRepository = additionalStoragePurchaseRepository;
        _emailJobScheduler = emailJobScheduler;
    }

    public async Task<StorageQuotaResponseDto> GetStorageQuotaAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await GetUserOrThrowAsync(userId, cancellationToken);

        var subscriptions = await _subscriptionRepository.GetByUserIdAsync(userId, cancellationToken);

        var hasActiveSubscription = subscriptions.Any(s => s.Status == ActiveSubscriptionStatus);

        var allocatedStorageBytes = user.Allocatedstoragebytes;
        var usedStorageBytes = user.Usedstoragebytes;

        var availableStorageBytes = Math.Max(0, allocatedStorageBytes - usedStorageBytes);

        var isOverQuota = usedStorageBytes > allocatedStorageBytes;

        decimal usagePercentage;

        if (allocatedStorageBytes <= 0)
        {
            usagePercentage = usedStorageBytes > 0 ? 100 : 0;
        }
        else
        {
            usagePercentage = decimal.Round(((decimal)usedStorageBytes / allocatedStorageBytes) * 100, 2, MidpointRounding.AwayFromZero);
        }

        return new StorageQuotaResponseDto
        {
            AllocatedStorageBytes = allocatedStorageBytes,
            UsedStorageBytes = usedStorageBytes,
            AvailableStorageBytes = availableStorageBytes,
            UsagePercentage = usagePercentage,
            HasActiveSubscription = hasActiveSubscription,
            CanPerformStorageWriteOperations = user.Isactive && hasActiveSubscription,
            IsOverQuota = isOverQuota
        };
    }

    public async Task EnsureStorageManagementAccessAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await GetUserOrThrowAsync(userId, cancellationToken);

        if (!user.Isactive)
        {
            throw new InvalidOperationException("Your user account is inactive. Storage management operations are not available.");
        }

        var subscriptions = await _subscriptionRepository.GetByUserIdAsync(userId, cancellationToken);

        var hasActiveSubscription = subscriptions.Any(s => s.Status == ActiveSubscriptionStatus);

        if (!hasActiveSubscription)
        {
            throw new InvalidOperationException("Your storage subscription is inactive or expired. " + "You can view and download your existing files, but storage management operations " + "require an active storage subscription.");
        }
    }

    public async Task EnsureSufficientStorageAsync(Guid userId, long requestedBytes, CancellationToken cancellationToken = default)
    {
        if (requestedBytes <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(requestedBytes), "Requested storage size must be greater than zero.");
        }

        await EnsureStorageManagementAccessAsync(userId, cancellationToken);

        var user = await GetUserOrThrowAsync(userId, cancellationToken);

        var availableStorageBytes = Math.Max(0, user.Allocatedstoragebytes - user.Usedstoragebytes);

        if (requestedBytes > availableStorageBytes)
        {
            throw new InvalidOperationException($"Insufficient storage quota. " + $"Requested: {requestedBytes} bytes. " + $"Available: {availableStorageBytes} bytes. " + "Please purchase additional storage or select a storage plan with sufficient capacity.");
        }

        var quota = await GetStorageQuotaAsync(userId, cancellationToken);
        if (quota.AllocatedStorageBytes > 0 && quota.UsagePercentage >= 90m)
        {
            await _emailJobScheduler.QueueQuotaWarningEmailAsync(user.Email, quota.UsagePercentage, cancellationToken);
        }
    }

    public async Task AdjustUsedStorageAsync(Guid userId, long deltaBytes, CancellationToken cancellationToken = default)
    {
        if (deltaBytes == 0)
        {
            return;
        }

        if (deltaBytes > 0)
        {
            await ReserveStorageAsync(userId, deltaBytes, cancellationToken);

            return;
        }

        if (deltaBytes == long.MinValue)
        {
            throw new ArgumentOutOfRangeException(nameof(deltaBytes), "The requested storage adjustment is outside the supported range.");
        }

        await ReleaseStorageAsync(userId, -deltaBytes, cancellationToken);
    }

    public async Task EnsureSubscriptionAllocationSufficientAsync(Guid userId, int storagePlanStorageGb, CancellationToken cancellationToken = default)
    {
        if (storagePlanStorageGb <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(storagePlanStorageGb), "Storage plan size must be greater than zero.");
        }

        var user = await GetUserOrThrowAsync(userId, cancellationToken);

        var planStorageBytes = ConvertGbToBytes(storagePlanStorageGb);

        /*
         * Additional storage purchases are permanently owned by the user
         * and are only activated/deactivated based on the subscription lifecycle.
         *
         * Therefore, when a new subscription is activated, all historical
         * additional storage purchases will become active again.
         */
        var allPurchases = await _additionalStoragePurchaseRepository.GetByUserIdAsync(userId, cancellationToken);

        long totalAdditionalStorageBytes = 0;

        foreach (var purchase in allPurchases)
        {
            totalAdditionalStorageBytes = checked(totalAdditionalStorageBytes + ConvertGbToBytes(purchase.Storageamountgb));
        }

        var projectedAllocatedStorageBytes = checked(planStorageBytes + totalAdditionalStorageBytes);

        if (projectedAllocatedStorageBytes < user.Usedstoragebytes)
        {
            throw new InvalidOperationException("The selected storage plan and your existing additional storage " + "do not provide enough capacity for your current storage usage. " + "Please select a larger storage plan or purchase additional storage.");
        }
    }

    public async Task SetAllocatedStorageForActiveSubscriptionAsync(Guid userId, int storagePlanStorageGb, CancellationToken cancellationToken = default)
    {
        if (storagePlanStorageGb <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(storagePlanStorageGb), "Storage plan size must be greater than zero.");
        }

        var user = await GetUserOrThrowAsync(userId, cancellationToken);

        var planStorageBytes = ConvertGbToBytes(storagePlanStorageGb);

        /*
         * Once a subscription is active, every historical additional
         * storage purchase belonging to the user is activated.
         */
        var allPurchases = await _additionalStoragePurchaseRepository.GetByUserIdAsync(userId, cancellationToken);

        long totalAdditionalStorageBytes = 0;

        foreach (var purchase in allPurchases)
        {
            totalAdditionalStorageBytes = checked(totalAdditionalStorageBytes + ConvertGbToBytes(purchase.Storageamountgb));
        }

        var allocatedStorageBytes = checked(planStorageBytes + totalAdditionalStorageBytes);

        if (allocatedStorageBytes < user.Usedstoragebytes)
        {
            throw new InvalidOperationException("The resulting storage allocation is smaller than the user's current storage usage.");
        }

        user.Allocatedstoragebytes = allocatedStorageBytes;
        user.Updatedat = DateTime.UtcNow;

        _userRepository.Update(user);
    }

    public async Task IncreaseAllocatedStorageAsync(Guid userId, int additionalStorageGb, CancellationToken cancellationToken = default)
    {
        if (additionalStorageGb <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(additionalStorageGb), "Additional storage amount must be greater than zero.");
        }

        await EnsureStorageManagementAccessAsync(userId, cancellationToken);

        var user = await GetUserOrThrowAsync(userId, cancellationToken);

        var additionalStorageBytes = ConvertGbToBytes(additionalStorageGb);

        user.Allocatedstoragebytes = checked(user.Allocatedstoragebytes + additionalStorageBytes);

        user.Updatedat = DateTime.UtcNow;

        _userRepository.Update(user);
    }

    public async Task DeactivateStorageAllocationAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await GetUserOrThrowAsync(userId, cancellationToken);

        /*
         * Used storage is intentionally preserved.
         *
         * A cancelled or expired subscription means the user's
         * logical allocated capacity becomes zero, while existing
         * files remain available for viewing/downloading.
         */
        user.Allocatedstoragebytes = 0;
        user.Updatedat = DateTime.UtcNow;

        _userRepository.Update(user);
    }

    public async Task RecalculateAllocatedStorageAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await GetUserOrThrowAsync(userId, cancellationToken);

        var subscriptions = await _subscriptionRepository.GetByUserIdAsync(userId, cancellationToken);

        var activeSubscription = subscriptions.FirstOrDefault(s => s.Status == ActiveSubscriptionStatus);

        if (activeSubscription is null)
        {
            user.Allocatedstoragebytes = 0;
            user.Updatedat = DateTime.UtcNow;

            _userRepository.Update(user);

            return;
        }

        var storagePlan = await _storagePlanRepository.GetByIdAsync(activeSubscription.Storageplanid, cancellationToken);

        if (storagePlan is null)
        {
            throw new InvalidOperationException("The storage plan associated with the active subscription was not found.");
        }

        var activePurchases = await _additionalStoragePurchaseRepository.GetByUserIdAsync(userId, cancellationToken);

        long totalAdditionalStorageBytes = 0;

        foreach (var purchase in activePurchases.Where(p => p.Status == ActiveAdditionalStorageStatus))
        {
            totalAdditionalStorageBytes = checked(totalAdditionalStorageBytes + ConvertGbToBytes(purchase.Storageamountgb));
        }

        var allocatedStorageBytes = checked(ConvertGbToBytes(storagePlan.Storagesizegb) + totalAdditionalStorageBytes);

        if (allocatedStorageBytes < user.Usedstoragebytes)
        {
            throw new InvalidOperationException("The calculated storage allocation is smaller than the user's current storage usage.");
        }

        user.Allocatedstoragebytes = allocatedStorageBytes;
        user.Updatedat = DateTime.UtcNow;

        _userRepository.Update(user);
    }

    public async Task RecalculateUsedStorageAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await GetUserOrThrowAsync(userId, cancellationToken);

        /*
         * GetByUserIdAsync intentionally returns both active and
         * soft-deleted files.
         *
         * This matches the SkyVault rule that Recycle Bin items
         * continue consuming quota until permanent deletion.
         */
        var files = await _userFileRepository.GetByUserIdAsync(userId, cancellationToken);

        long totalUsedStorageBytes = 0;

        foreach (var file in files)
        {
            totalUsedStorageBytes = checked(totalUsedStorageBytes + file.Filesizebytes);
        }

        user.Usedstoragebytes = totalUsedStorageBytes;
        user.Updatedat = DateTime.UtcNow;

        _userRepository.Update(user);
    }

    private async Task<User> GetUserOrThrowAsync(Guid userId, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);

        if (user is null)
        {
            throw new InvalidOperationException("User account was not found.");
        }

        return user;
    }

    public async Task ReserveStorageAsync(Guid userId, long storageBytes, CancellationToken cancellationToken = default)
    {
        if (storageBytes <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(storageBytes), "Storage reservation must be greater than zero.");
        }

        await EnsureStorageManagementAccessAsync(userId, cancellationToken);

        var reserved = await _userRepository.TryReserveStorageAsync(userId, storageBytes, cancellationToken);

        if (!reserved)
        {
            throw new InvalidOperationException("Insufficient storage quota. " + "The requested operation cannot be completed because " + "there is not enough available storage.");
        }
    }

    public async Task ReleaseStorageAsync(Guid userId, long storageBytes, CancellationToken cancellationToken = default)
    {
        if (storageBytes <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(storageBytes), "Storage release must be greater than zero.");
        }

        var released = await _userRepository.ReleaseStorageAsync(userId, storageBytes, cancellationToken);

        if (!released)
        {
            throw new InvalidOperationException("Storage usage could not be released because " + "the requested amount exceeds the user's recorded usage.");
        }
    }

    private static long ConvertGbToBytes(int storageGb)
    {
        return checked((long)storageGb * BytesPerGigabyte);
    }
}
