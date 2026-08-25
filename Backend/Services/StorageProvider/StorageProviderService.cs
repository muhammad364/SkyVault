using AutoMapper;
using SkyVault.DTOs.StorageProvider;
using SkyVault.Models;
using SkyVault.Repository;
using SkyVault.Services.AuditLogService;

namespace SkyVault.Services.StorageProvider;

public class StorageProviderService : IStorageProviderService
{
    private readonly IStorageProviderRepository _storageProviderRepository;

    private readonly IMapper _mapper;

    private readonly IUnitOfWork _unitOfWork;
    private readonly IAuditLogService _auditLogService;

    public StorageProviderService(IStorageProviderRepository storageProviderRepository, IMapper mapper, IUnitOfWork unitOfWork, IAuditLogService auditLogService)
    {
        _storageProviderRepository = storageProviderRepository;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _auditLogService = auditLogService;
    }

    public async Task<StorageProviderResponseDto> CreateAsync(CreateStorageProviderRequestDto request, CancellationToken cancellationToken = default)
    {
        var name = request.Name.Trim();

        var providerType = request.ProviderType.Trim();

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new InvalidOperationException("Storage provider name is required.");
        }

        if (string.IsNullOrWhiteSpace(providerType))
        {
            throw new InvalidOperationException("Storage provider type is required.");
        }

        var existingProvider = await _storageProviderRepository.GetByNameAsync(name, cancellationToken);

        if (existingProvider is not null)
        {
            throw new InvalidOperationException("A storage provider with the specified name already exists.");
        }

        var storageProvider = _mapper.Map<Storageprovider>(request);

        storageProvider.Name = name;

        storageProvider.Providertype = providerType;

        storageProvider.Isactive = true;

        storageProvider.Createdat = DateTime.UtcNow;

        await _storageProviderRepository.AddAsync(storageProvider, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _auditLogService.RecordAsync("StorageProviderCreated", "StorageProvider", storageProvider.Providerid, "Administrator created a storage provider.", cancellationToken);

        return _mapper.Map<StorageProviderResponseDto>(storageProvider);
    }

    public async Task<StorageProviderResponseDto?> GetByIdAsync(Guid providerId, CancellationToken cancellationToken = default)
    {
        var storageProvider = await _storageProviderRepository.GetByIdAsync(providerId, cancellationToken);

        if (storageProvider is null)
        {
            return null;
        }

        return _mapper.Map<StorageProviderResponseDto>(storageProvider);
    }

    public async Task<IEnumerable<StorageProviderResponseDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var storageProviders = await _storageProviderRepository.GetAllAsync(cancellationToken);

        return _mapper.Map<IEnumerable<StorageProviderResponseDto>>(storageProviders);
    }

    public async Task<StorageProviderResponseDto> UpdateAsync(Guid providerId, UpdateStorageProviderRequestDto request, CancellationToken cancellationToken = default)
    {
        var storageProvider = await _storageProviderRepository.GetByIdAsync(providerId, cancellationToken);

        if (storageProvider is null)
        {
            throw new InvalidOperationException("Storage provider was not found.");
        }

        var name = request.Name.Trim();

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new InvalidOperationException("Storage provider name is required.");
        }

        var existingProvider = await _storageProviderRepository.GetByNameAsync(name, cancellationToken);

        if (existingProvider is not null && existingProvider.Providerid != providerId)
        {
            throw new InvalidOperationException("A storage provider with the specified name already exists.");
        }

        _mapper.Map(request, storageProvider);

        storageProvider.Name = name;

        _storageProviderRepository.Update(storageProvider);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _auditLogService.RecordAsync("StorageProviderUpdated", "StorageProvider", storageProvider.Providerid, "Administrator updated a storage provider.", cancellationToken);

        return _mapper.Map<StorageProviderResponseDto>(storageProvider);
    }

    public async Task<StorageProviderResponseDto> ActivateAsync(Guid providerId, CancellationToken cancellationToken = default)
    {
        var storageProvider = await _storageProviderRepository.GetByIdAsync(providerId, cancellationToken);

        if (storageProvider is null)
        {
            throw new InvalidOperationException("Storage provider was not found.");
        }

        storageProvider.Isactive = true;

        _storageProviderRepository.Update(storageProvider);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _auditLogService.RecordAsync("StorageProviderActivated", "StorageProvider", storageProvider.Providerid, "Administrator activated a storage provider.", cancellationToken);

        return _mapper.Map<StorageProviderResponseDto>(storageProvider);
    }

    public async Task<StorageProviderResponseDto> DeactivateAsync(Guid providerId, CancellationToken cancellationToken = default)
    {
        var storageProvider = await _storageProviderRepository.GetByIdAsync(providerId, cancellationToken);

        if (storageProvider is null)
        {
            throw new InvalidOperationException("Storage provider was not found.");
        }

        storageProvider.Isactive = false;

        _storageProviderRepository.Update(storageProvider);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _auditLogService.RecordAsync("StorageProviderDeactivated", "StorageProvider", storageProvider.Providerid, "Administrator deactivated a storage provider.", cancellationToken);

        return _mapper.Map<StorageProviderResponseDto>(storageProvider);
    }
}
