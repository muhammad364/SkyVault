using SkyVault.DTOs.StorageQuota;

namespace SkyVault.Services.StorageQuotaService;

public interface IStorageQuotaService
{
    Task<StorageQuotaResponseDto> GetStorageQuotaAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task EnsureStorageManagementAccessAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task EnsureSufficientStorageAsync(
        Guid userId,
        long requestedBytes,
        CancellationToken cancellationToken = default);

    Task AdjustUsedStorageAsync(
        Guid userId,
        long deltaBytes,
        CancellationToken cancellationToken = default);

    Task EnsureSubscriptionAllocationSufficientAsync(
        Guid userId,
        int storagePlanStorageGb,
        CancellationToken cancellationToken = default);

    Task SetAllocatedStorageForActiveSubscriptionAsync(
        Guid userId,
        int storagePlanStorageGb,
        CancellationToken cancellationToken = default);

    Task IncreaseAllocatedStorageAsync(
        Guid userId,
        int additionalStorageGb,
        CancellationToken cancellationToken = default);

    Task DeactivateStorageAllocationAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task RecalculateAllocatedStorageAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task RecalculateUsedStorageAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task ReserveStorageAsync(
        Guid userId,
        long storageBytes,
        CancellationToken cancellationToken = default);
    
    Task ReleaseStorageAsync(
        Guid userId,
        long storageBytes,
        CancellationToken cancellationToken = default);
}