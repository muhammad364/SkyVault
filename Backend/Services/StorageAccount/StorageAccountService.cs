using AutoMapper;
using SkyVault.DTOs.StorageAccount;
using SkyVault.Models;
using SkyVault.Repository;
using SkyVault.Services.AuditLogService;

namespace SkyVault.Services.StorageAccount;

public class StorageAccountService : IStorageAccountService
{
    private readonly IStorageAccountRepository _storageAccountRepository;

    private readonly IStorageProviderRepository _storageProviderRepository;

    private readonly IMapper _mapper;

    private readonly IUnitOfWork _unitOfWork;
    private readonly IAuditLogService _auditLogService;

    public StorageAccountService(IStorageAccountRepository storageAccountRepository, IStorageProviderRepository storageProviderRepository, IMapper mapper, IUnitOfWork unitOfWork, IAuditLogService auditLogService)
    {
        _storageAccountRepository = storageAccountRepository;
        _storageProviderRepository = storageProviderRepository;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _auditLogService = auditLogService;
    }

    public async Task<StorageAccountResponseDto> CreateAsync(CreateStorageAccountRequestDto request, CancellationToken cancellationToken = default)
    {
        var provider = await _storageProviderRepository.GetByIdAsync(request.ProviderId, cancellationToken);

        if (provider is null)
        {
            throw new InvalidOperationException("Storage provider was not found.");
        }

        if (!provider.Isactive)
        {
            throw new InvalidOperationException("The selected storage provider is inactive.");
        }

        var accountName = request.AccountName.Trim();

        if (string.IsNullOrWhiteSpace(accountName))
        {
            throw new InvalidOperationException("Storage account name is required.");
        }

        if (request.TotalCapacityBytes <= 0)
        {
            throw new InvalidOperationException("Total storage capacity must be greater than zero.");
        }

        if (request.Priority <= 0)
        {
            throw new InvalidOperationException("Storage account priority must be greater than zero.");
        }

        var storageAccount = _mapper.Map<Storageaccount>(request);

        storageAccount.Accountname = accountName;

        storageAccount.Usedcapacitybytes = 0;

        storageAccount.Isactive = true;

        storageAccount.Createdat = DateTime.UtcNow;

        await _storageAccountRepository.AddAsync(storageAccount, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _auditLogService.RecordAsync("StorageAccountCreated", "StorageAccount", storageAccount.Storageaccountid, "Administrator created a storage account.", cancellationToken);

        storageAccount.Provider = provider;

        return _mapper.Map<StorageAccountResponseDto>(storageAccount);
    }

    public async Task<StorageAccountResponseDto?> GetByIdAsync(Guid storageAccountId, CancellationToken cancellationToken = default)
    {
        var storageAccount = await _storageAccountRepository.GetByIdAsync(storageAccountId, cancellationToken);

        if (storageAccount is null)
        {
            return null;
        }

        return _mapper.Map<StorageAccountResponseDto>(storageAccount);
    }

    public async Task<IEnumerable<StorageAccountResponseDto>> GetAllAsync(bool? isActive = null, CancellationToken cancellationToken = default)
    {
        var storageAccounts = await _storageAccountRepository.GetAllAsync(isActive, cancellationToken);

        return _mapper.Map<IEnumerable<StorageAccountResponseDto>>(storageAccounts);
    }

    public async Task<StorageAccountResponseDto> UpdateAsync(Guid storageAccountId, UpdateStorageAccountRequestDto request, CancellationToken cancellationToken = default)
    {
        var storageAccount = await _storageAccountRepository.GetByIdAsync(storageAccountId, cancellationToken);

        if (storageAccount is null)
        {
            throw new InvalidOperationException("Storage account was not found.");
        }

        var accountName = request.AccountName.Trim();

        if (string.IsNullOrWhiteSpace(accountName))
        {
            throw new InvalidOperationException("Storage account name is required.");
        }

        if (request.TotalCapacityBytes <= 0)
        {
            throw new InvalidOperationException("Total storage capacity must be greater than zero.");
        }

        if (request.TotalCapacityBytes <storageAccount.Usedcapacitybytes)
        {
            throw new InvalidOperationException("Total capacity cannot be smaller than the currently used capacity.");
        }

        if (request.Priority <= 0)
        {
            throw new InvalidOperationException("Storage account priority must be greater than zero.");
        }

        _mapper.Map(request, storageAccount);

        storageAccount.Accountname = accountName;

        _storageAccountRepository.Update(storageAccount);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _auditLogService.RecordAsync("StorageAccountUpdated", "StorageAccount", storageAccount.Storageaccountid, "Administrator updated a storage account.", cancellationToken);

        return _mapper.Map<StorageAccountResponseDto>(storageAccount);
    }

    public async Task<StorageAccountResponseDto> ActivateAsync(Guid storageAccountId, CancellationToken cancellationToken = default)
    {
        var storageAccount = await _storageAccountRepository.GetByIdAsync(storageAccountId, cancellationToken);

        if (storageAccount is null)
        {
            throw new InvalidOperationException("Storage account was not found.");
        }

        var provider = await _storageProviderRepository.GetByIdAsync(storageAccount.Providerid, cancellationToken);

        if (provider is null)
        {
            throw new InvalidOperationException("The storage provider associated with the account was not found.");
        }

        if (!provider.Isactive)
        {
            throw new InvalidOperationException("The storage provider is inactive. " + "Activate the provider before activating this storage account.");
        }

        storageAccount.Isactive = true;

        _storageAccountRepository.Update(storageAccount);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _auditLogService.RecordAsync("StorageAccountActivated", "StorageAccount", storageAccount.Storageaccountid, "Administrator activated a storage account.", cancellationToken);

        return _mapper.Map<StorageAccountResponseDto>(storageAccount);
    }

    public async Task<StorageAccountResponseDto> DeactivateAsync(Guid storageAccountId, CancellationToken cancellationToken = default)
    {
        var storageAccount = await _storageAccountRepository.GetByIdAsync(storageAccountId, cancellationToken);

        if (storageAccount is null)
        {
            throw new InvalidOperationException("Storage account was not found.");
        }

        storageAccount.Isactive = false;

        _storageAccountRepository.Update(storageAccount);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _auditLogService.RecordAsync("StorageAccountDeactivated", "StorageAccount", storageAccount.Storageaccountid, "Administrator deactivated a storage account.", cancellationToken);

        return _mapper.Map<StorageAccountResponseDto>(storageAccount);
    }

    public async Task ReserveCapacityForAccountAsync(Guid storageAccountId, long requestedBytes, CancellationToken cancellationToken = default)
    {
        if (requestedBytes <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(requestedBytes), "Requested storage capacity must be greater than zero.");
        }

        var storageAccount = await _storageAccountRepository.GetByIdAsync(storageAccountId, cancellationToken);

        if (storageAccount is null)
        {
            throw new InvalidOperationException("Storage account was not found.");
        }

        if (!storageAccount.Isactive)
        {
            throw new InvalidOperationException("The selected storage account is inactive.");
        }

        if (storageAccount.Provider is null || !storageAccount.Provider.Isactive)
        {
            throw new InvalidOperationException("The storage provider associated with the account is inactive.");
        }

        var reserved = await _storageAccountRepository.TryReserveCapacityAsync(storageAccountId, requestedBytes, cancellationToken);

        if (!reserved)
        {
            throw new InvalidOperationException("The selected storage account does not have enough physical storage capacity.");
        }
    }

    public async Task ReleaseCapacityAsync(Guid storageAccountId, long capacityBytes, CancellationToken cancellationToken = default)
    {
        if (capacityBytes <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(capacityBytes), "Capacity release must be greater than zero.");
        }

        var released = await _storageAccountRepository.ReleaseCapacityAsync(storageAccountId, capacityBytes, cancellationToken);

        if (!released)
        {
            throw new InvalidOperationException("Physical storage capacity could not be released.");
        }
    }
}
