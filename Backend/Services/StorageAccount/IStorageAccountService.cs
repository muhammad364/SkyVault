using SkyVault.DTOs.StorageAccount;
using SkyVault.Models;

namespace SkyVault.Services.StorageAccount;

public interface IStorageAccountService
{
    Task<StorageAccountResponseDto> CreateAsync(
        CreateStorageAccountRequestDto request,
        CancellationToken cancellationToken = default);

    Task<StorageAccountResponseDto?> GetByIdAsync(
        Guid storageAccountId,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<StorageAccountResponseDto>> GetAllAsync(
        bool? isActive = null,
        CancellationToken cancellationToken = default);

    Task<StorageAccountResponseDto> UpdateAsync(
        Guid storageAccountId,
        UpdateStorageAccountRequestDto request,
        CancellationToken cancellationToken = default);

    Task<StorageAccountResponseDto> ActivateAsync(
        Guid storageAccountId,
        CancellationToken cancellationToken = default);

    Task<StorageAccountResponseDto> DeactivateAsync(
        Guid storageAccountId,
        CancellationToken cancellationToken = default);

    Task<Storageaccount> ReserveCapacityAsync(
        long requestedBytes,
        CancellationToken cancellationToken = default);

    Task ReleaseCapacityAsync(
        Guid storageAccountId,
        long capacityBytes,
        CancellationToken cancellationToken = default);
}