using AutoMapper;
using SkyVault.DTOs.Admin;
using SkyVault.Models;
using SkyVault.Repository;
using SkyVault.Services.AuditLogService;

namespace SkyVault.Services.Admin;

public class AdminService : IAdminService
{
    private readonly IUserRepository _userRepository;
    private readonly IStoragePlanRepository _storagePlanRepository;
    private readonly ISubscriptionRepository _subscriptionRepository;
    private readonly IStorageAccountRepository _storageAccountRepository;
    private readonly IMapper _mapper;

    private readonly IUnitOfWork _unitOfWork;
    private readonly IAuditLogService _auditLogService;

    public AdminService(
        IUserRepository userRepository,
        IStoragePlanRepository storagePlanRepository,
        ISubscriptionRepository subscriptionRepository,
        IStorageAccountRepository storageAccountRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IAuditLogService auditLogService)
    {
        _userRepository = userRepository;
        _storagePlanRepository = storagePlanRepository;
        _subscriptionRepository = subscriptionRepository;
        _storageAccountRepository = storageAccountRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _auditLogService = auditLogService;
    }


    public async Task<IEnumerable<AdminUserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default)
    {
        var users = await _userRepository.GetAllAsync(cancellationToken);

        return _mapper.Map<IEnumerable<AdminUserDto>>(users);
    }

    public async Task<AdminUserDto> GetUserByIdAsync(Guid userId,CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);

        if (user == null)
            throw new KeyNotFoundException("User not found.");

        return _mapper.Map<AdminUserDto>(user);
    }

    public async Task<AdminUserDto> ActivateUserAsync(Guid userId,CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);

        if (user == null)
            throw new KeyNotFoundException("User not found.");

        if (!user.Isactive)
        {
            user.Isactive = true;

            _userRepository.Update(user);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await _auditLogService.RecordAsync(
                "UserActivated",
                "User",
                user.Userid,
                "Administrator activated a user account.",
                cancellationToken);
        }

        return _mapper.Map<AdminUserDto>(user);
    }

    public async Task<AdminUserDto> DeactivateUserAsync(Guid userId,CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);

        if (user == null)
            throw new KeyNotFoundException("User not found.");

        if (user.Isactive)
        {
            user.Isactive = false;

            _userRepository.Update(user);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            await _auditLogService.RecordAsync(
                "UserDeactivated",
                "User",
                user.Userid,
                "Administrator deactivated a user account.",
                cancellationToken);
        }

        return _mapper.Map<AdminUserDto>(user);
    }

    public async Task<StorageOverviewDto> GetStorageOverviewAsync(CancellationToken cancellationToken = default)
    {
        var storageAccounts = await _storageAccountRepository.GetAllAsync(true, cancellationToken);

        var users = await _userRepository.GetAllAsync(cancellationToken);

        var customerUsers = users.Where(u => u.Role == 0).ToList();

        var activeStorageAccounts = storageAccounts.Where(sa => sa.Isactive).ToList();

        long physicalStorageBytes = activeStorageAccounts.Sum(sa => sa.Totalcapacitybytes);

        long allocatedStorageBytes = customerUsers.Sum(u => u.Allocatedstoragebytes);

        long usedStorageBytes = activeStorageAccounts.Sum(sa => sa.Usedcapacitybytes);

        long availableStorageBytes = physicalStorageBytes - allocatedStorageBytes;

        return new StorageOverviewDto
        {
            TotalPhysicalCapacityBytes = physicalStorageBytes,

            TotalAllocatedBytes = allocatedStorageBytes,

            TotalUsedBytes = usedStorageBytes,

            TotalAvailableBytes = availableStorageBytes
        };
    }

    public async Task<UserStorageAllocationDto> GetUserStorageAllocationAsync(Guid userId,CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);

        if (user == null)
            throw new KeyNotFoundException("User not found.");

        return _mapper.Map<UserStorageAllocationDto>(user);
    }

    public async Task<SystemStatisticsDto> GetSystemStatisticsAsync(CancellationToken cancellationToken = default)
    {
        var users = await _userRepository.GetAllAsync(cancellationToken);
        var plans = await _storagePlanRepository.GetAllAsync(true, cancellationToken);
        var subscriptions = await _subscriptionRepository.GetAllAsync(cancellationToken);

        return new SystemStatisticsDto
        {
            TotalUsers = users.Count(),
        
            ActiveUsers = users.Count(u => u.Isactive),
        
            TotalStoragePlans = plans.Count(),
        
            ActiveStoragePlans = plans.Count(p => p.Isactive),
        
            TotalSubscriptions = subscriptions.Count(),
        
            ActiveSubscriptions = subscriptions.Count(s => s.Status == 0)
        };
    }
}
