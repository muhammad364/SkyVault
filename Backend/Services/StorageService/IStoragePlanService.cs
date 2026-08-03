using SkyVault.DTOs.StoragePlan.Responses;
using SkyVault.DTOs.StoragePlan.Requests;

namespace SkyVault.Services.StorageService;

public interface IStoragePlanService
{
    Task<IEnumerable<StoragePlanResponseDto>> GetAllAsync(bool? isActive = true, CancellationToken cancellationToken = default);

    Task<StoragePlanResponseDto> GetByIdAsync(Guid storagePlanId, CancellationToken cancellationToken = default);

    Task<StoragePlanResponseDto> CreateAsync(CreateStoragePlanRequestDto request, CancellationToken cancellationToken = default);

    Task<StoragePlanResponseDto> UpdateAsync(Guid storagePlanId, UpdateStoragePlanRequestDto request, CancellationToken cancellationToken = default);
}