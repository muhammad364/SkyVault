using AutoMapper;
using SkyVault.DTOs.Payments;
using SkyVault.DTOs.Subscription;
using SkyVault.Models;
using SkyVault.Repository;
using SkyVault.Services.StorageService.PaymentService;

namespace SkyVault.Services.StorageService;

public class SubscriptionService : ISubscriptionService
{
    private const short ActiveStatus = 0;
    private const short ExpiredStatus = 1;
    private const short CancelledStatus = 2;

    private readonly ISubscriptionRepository _subscriptionRepository;
    private readonly IStoragePlanRepository _storagePlanRepository;
    private readonly IPaymentService _paymentService;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;

    public SubscriptionService(
        ISubscriptionRepository subscriptionRepository,
        IStoragePlanRepository storagePlanRepository,
        IPaymentService paymentService,
        IMapper mapper,
        IUnitOfWork unitOfWork)
    {
        _subscriptionRepository = subscriptionRepository;
        _storagePlanRepository = storagePlanRepository;
        _paymentService = paymentService;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
    }

    public async Task<SubscriptionResponseDto> SubscribeAsync(Guid userId, SubscribeRequestDto request, CancellationToken cancellationToken = default)
    {
        var storagePlan = await _storagePlanRepository.GetByIdAsync(request.StoragePlanId, cancellationToken);

        if (storagePlan is null)
        {
            throw new InvalidOperationException("Storage plan not found.");
        }

        if (!storagePlan.Isactive)
        {
            throw new InvalidOperationException("Selected storage plan is inactive.");
        }

        var subscriptions = await _subscriptionRepository.GetByUserIdAsync(userId, cancellationToken);

        var activeSubscription = subscriptions.FirstOrDefault(s => s.Status == ActiveStatus);

        // 3. Check replacement confirmation
        if (activeSubscription != null &&
            !request.ReplaceExistingSubscription)
        {
            throw new InvalidOperationException(
                "You already have an active subscription. Please confirm replacement.");
        }

        // 4. Prepare payment
        request.Payment.Amount = storagePlan.Price;

        // 5. Process payment
        var paymentResult = await _paymentService.ProcessPaymentAsync(
            request.Payment,
            cancellationToken);

        if (!paymentResult.IsSuccessful)
        {
            throw new InvalidOperationException(paymentResult.Message);
        }

        // 6. Cancel previous subscription AFTER successful payment
        if (activeSubscription != null)
        {
            activeSubscription.Status = CancelledStatus;
            _subscriptionRepository.Update(activeSubscription);
        }

        // 7. Create new subscription
        var subscription = _mapper.Map<Subscription>(request);

        subscription.Userid = userId;
        subscription.Startdate = DateTime.UtcNow;
        subscription.Enddate = DateTime.UtcNow.AddMonths(storagePlan.Billingcycle);
        subscription.Status = ActiveStatus;

        // Needed for AutoMapper response
        subscription.Storageplan = storagePlan;

        await _subscriptionRepository.AddAsync(
            subscription,
            cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<SubscriptionResponseDto>(subscription);
    }

    public async Task<SubscriptionResponseDto?> GetCurrentSubscriptionAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var subscriptions = await _subscriptionRepository.GetByUserIdAsync(
            userId,
            cancellationToken);

        var activeSubscription = subscriptions.FirstOrDefault(
            s => s.Status == ActiveStatus);

        if (activeSubscription == null)
        {
            return null;
        }

        return _mapper.Map<SubscriptionResponseDto>(activeSubscription);
    }
}