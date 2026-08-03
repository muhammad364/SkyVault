using AutoMapper;
using SkyVault.Models;
using SkyVault.DTOs.StoragePlan.Requests;
using SkyVault.DTOs.StoragePlan.Responses;
using SkyVault.Repository;
using SkyVault.Data;
using System.IO.Pipelines;

namespace SkyVault.Services.StorageService;

public class StoragePlanService : IStoragePlanService
{
    private readonly IMapper _mapper;
    private readonly IStoragePlanRepository _storagePlanRepository;
    private readonly IUnitOfWork _unitOfWork;

    public StoragePlanService (IMapper mapper, IStoragePlanRepository repository, IUnitOfWork unitOfWork)
    {
        _mapper = mapper;
        _storagePlanRepository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<StoragePlanResponseDto>> GetAllAsync (bool? isActive, CancellationToken cancellationToken = default)
    {
        var plans = await _storagePlanRepository.GetAllAsync(isActive, cancellationToken);

        return _mapper.Map<IEnumerable<StoragePlanResponseDto>>(plans);
    }

    public async Task<StoragePlanResponseDto> GetByIdAsync(Guid storagePlanId, CancellationToken cancellationToken = default)
    {
        var plan = await _storagePlanRepository.GetByIdAsync(storagePlanId, cancellationToken);

        if (plan == null)
        {
            throw new KeyNotFoundException("No storage plan found against this id.");
        }
        return _mapper.Map<StoragePlanResponseDto>(plan);
    }

    public async Task<StoragePlanResponseDto> CreateAsync(CreateStoragePlanRequestDto request, CancellationToken cancellationToken = default)
    {
        var existName = await _storagePlanRepository.GetByNameAsync(request.Name, cancellationToken);

        if (existName != null)
        {
            throw new InvalidOperationException("A plan with the same name already exists.");
        }
        
        var storagePlan = _mapper.Map<Storageplan>(request);
        
        await _storagePlanRepository.AddAsync(storagePlan, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<StoragePlanResponseDto>(storagePlan);

    }

    public async Task<StoragePlanResponseDto> UpdateAsync(Guid storagePlanId, UpdateStoragePlanRequestDto request, CancellationToken cancellationToken = default)
    {
        var existingPlan = await _storagePlanRepository.GetByIdAsync(storagePlanId, cancellationToken);

        if (existingPlan == null)
        {
            throw new KeyNotFoundException($"Storage plan with ID '{storagePlanId}' was not found.");
        }

        var planWithSameName = await _storagePlanRepository.GetByNameAsync(request.Name, cancellationToken);

        if (planWithSameName != null && planWithSameName.Storageplanid != storagePlanId)
        {
            throw new InvalidOperationException($"A storage plan with the name '{request.Name}' already exists.");
        }

        _mapper.Map(request, existingPlan);

        _storagePlanRepository.Update(existingPlan);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<StoragePlanResponseDto>(existingPlan);
    }
}