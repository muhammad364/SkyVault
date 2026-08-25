using SkyVault.DTOs.StorageProvider;

namespace SkyVault.Services.StorageProvider;

public interface IStorageProviderService
{
    Task<StorageProviderResponseDto> CreateAsync(CreateStorageProviderRequestDto request, CancellationToken cancellationToken = default);

    Task<StorageProviderResponseDto?> GetByIdAsync(Guid providerId, CancellationToken cancellationToken = default);

    Task<IEnumerable<StorageProviderResponseDto>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<StorageProviderResponseDto> UpdateAsync(Guid providerId, UpdateStorageProviderRequestDto request, CancellationToken cancellationToken = default);

    Task<StorageProviderResponseDto> ActivateAsync(Guid providerId, CancellationToken cancellationToken = default);

    Task<StorageProviderResponseDto> DeactivateAsync(Guid providerId, CancellationToken cancellationToken = default);
}
