using SkyVault.DTOs.Admin;

namespace SkyVault.Services.Admin;

public interface IAdminService
{
    //Managing Users
    Task<IEnumerable<AdminUserDto>> GetUsersAsync(CancellationToken cancellationToken = default);

    Task<AdminUserDto> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<AdminUserDto> ActivateUserAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<AdminUserDto> DeactivateUserAsync(Guid userId, CancellationToken cancellationToken = default);

    // Storage Monitoring
    Task<StorageOverviewDto> GetStorageOverviewAsync(CancellationToken cancellationToken = default);

    Task<UserStorageAllocationDto> GetUserStorageAllocationAsync(Guid userId, CancellationToken cancellationToken = default);

    // System Monitoring
    Task<SystemStatisticsDto> GetSystemStatisticsAsync(CancellationToken cancellationToken = default);
}