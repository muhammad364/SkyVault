using SkyVault.DTOs.Admin;

namespace SkyVault.Services.Admin;

public interface IAdminService
{
    // User Management

    Task<IEnumerable<AdminUserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default);

    Task<AdminUserDto> GetUserByIdAsync(Guid userId,CancellationToken cancellationToken = default);

    Task<AdminUserDto> ActivateUserAsync(Guid userId,CancellationToken cancellationToken = default);

    Task<AdminUserDto> DeactivateUserAsync(Guid userId,CancellationToken cancellationToken = default);


    //Storage Monitoring

    Task<StorageOverviewDto> GetStorageOverviewAsync(CancellationToken cancellationToken = default);

    Task<UserStorageAllocationDto> GetUserStorageAllocationAsync(Guid userId,CancellationToken cancellationToken = default);


    // Dashboard Statistics

    Task<SystemStatisticsDto> GetSystemStatisticsAsync(CancellationToken cancellationToken = default);
}