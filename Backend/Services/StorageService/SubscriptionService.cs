using AutoMapper;
using SkyVault.DTOs.Subscription;
using SkyVault.Models;
using SkyVault.Repository;
using SkyVault.Services.StorageService.PaymentService;
using SkyVault.Services.StorageQuotaService;

namespace SkyVault.Services.SubscriptionService;

public class SubscriptionService : ISubscriptionService
{
    private const short ActiveStatus = 0;
    private const short ExpiredStatus = 1;
    private const short CancelledStatus = 2;

    private const int GracePeriodDays = 30;

    private readonly ISubscriptionRepository _subscriptionRepository;

    private readonly IStoragePlanRepository _storagePlanRepository;

    private readonly IAdditionalStoragePurchaseService _additionalStoragePurchaseService;

    private readonly IStorageQuotaService _storageQuotaService;

    private readonly IPaymentService _paymentService;

    private readonly IMapper _mapper;

    private readonly IUnitOfWork _unitOfWork;

    public SubscriptionService(
        ISubscriptionRepository subscriptionRepository,
        IStoragePlanRepository storagePlanRepository,
        IAdditionalStoragePurchaseService additionalStoragePurchaseService,
        IStorageQuotaService storageQuotaService,
        IPaymentService paymentService,
        IMapper mapper,
        IUnitOfWork unitOfWork)
    {
        _subscriptionRepository = subscriptionRepository;
        _storagePlanRepository = storagePlanRepository;
        _additionalStoragePurchaseService = additionalStoragePurchaseService;
        _paymentService = paymentService;
        _storageQuotaService = storageQuotaService;
        _mapper = mapper;
        _unitOfWork = unitOfWork;

    }

    public async Task<SubscriptionResponseDto> SubscribeAsync(
        Guid userId,
        SubscribeRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var storagePlan =await _storagePlanRepository.GetByIdAsync(request.StoragePlanId, cancellationToken);

        if (storagePlan is null)
        {
            throw new InvalidOperationException("Storage plan not found.");
        }

        if (!storagePlan.Isactive)
        {
            throw new InvalidOperationException("Selected storage plan is inactive.");
        }

        if (storagePlan.Billingcycle <= 0)
        {
            throw new InvalidOperationException("Selected storage plan has an invalid billing cycle.");
        }

        var subscriptions = await _subscriptionRepository.GetByUserIdAsync( userId, cancellationToken);

        var activeSubscription = subscriptions.FirstOrDefault(s => s.Status == ActiveStatus);

        if (activeSubscription is not null && !request.ReplaceExistingSubscription)
        {
            throw new InvalidOperationException("You already have an active subscription. " + "Please confirm that you want to replace it.");
        }

        await _storageQuotaService.EnsureSubscriptionAllocationSufficientAsync(userId, storagePlan.Storagesizegb, cancellationToken);

        // Server determines the payment amount.
        request.Payment.Amount = storagePlan.Price;

        var paymentResult = await _paymentService.ProcessPaymentAsync(request.Payment, cancellationToken);

        if (!paymentResult.IsSuccessful)
        {
            throw new InvalidOperationException(paymentResult.Message);
        }

        // Replacement of an active plan is immediate.
        // Therefore, the old subscription does NOT enter a grace period.
        if (activeSubscription is not null)
        {
            activeSubscription.Status = CancelledStatus;

            activeSubscription.Graceperiodenddate = null;

            _subscriptionRepository.Update(activeSubscription);
        }

        var now = DateTime.UtcNow;

        var subscription = _mapper.Map<Subscription>(request);

        subscription.Userid = userId;

        subscription.Startdate = now;

        subscription.Enddate = now.AddMonths(storagePlan.Billingcycle);

        subscription.Status = ActiveStatus;

        subscription.Graceperiodenddate = null;

        subscription.Storageplan = storagePlan;

        await _subscriptionRepository.AddAsync(subscription, cancellationToken);

        // If the user had previous additional storage purchases,
        // they are active while the new base subscription is active.
        await _additionalStoragePurchaseService.ActivatePurchasesAsync(userId, cancellationToken);

        await _storageQuotaService.SetAllocatedStorageForActiveSubscriptionAsync(userId, storagePlan.Storagesizegb, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<SubscriptionResponseDto>(subscription);
    }

    public async Task<SubscriptionResponseDto?> GetCurrentSubscriptionAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var subscriptions = await _subscriptionRepository.GetByUserIdAsync(userId, cancellationToken);

        var now = DateTime.UtcNow;

        var subscription = subscriptions.FirstOrDefault(s => s.Status == ActiveStatus);

        if (subscription is null)
        {
            subscription =subscriptions.Where(s =>
                            (s.Status == CancelledStatus ||
                             s.Status == ExpiredStatus) &&
                            s.Graceperiodenddate.HasValue &&
                            s.Graceperiodenddate.Value > now)
                    .OrderByDescending(s => s.Startdate)
                    .FirstOrDefault();
        }

        if (subscription is null)
        {
            return null;
        }

        var storagePlan = await _storagePlanRepository.GetByIdAsync(subscription.Storageplanid,cancellationToken);

        if (storagePlan is null)
        {
            throw new InvalidOperationException("Storage plan associated with the subscription was not found.");
        }

        subscription.Storageplan = storagePlan;

        return _mapper.Map<SubscriptionResponseDto>(subscription);
    }

    public async Task<SubscriptionResponseDto> RenewAsync(
        Guid userId,
        RenewSubscriptionRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var subscriptions = await _subscriptionRepository.GetByUserIdAsync(userId, cancellationToken);

        var now = DateTime.UtcNow;

        var subscription =subscriptions.FirstOrDefault(s => s.Status == ActiveStatus);

        if (subscription is null)
        {
            subscription =subscriptions
                    .Where(
                        s =>
                            (s.Status == CancelledStatus ||
                             s.Status == ExpiredStatus) &&
                            s.Graceperiodenddate.HasValue &&
                            s.Graceperiodenddate.Value > now)
                    .OrderByDescending(
                        s => s.Startdate)
                    .FirstOrDefault();
        }

        if (subscription is null)
        {
            throw new InvalidOperationException("There is no active subscription or subscription within the grace period to renew.");
        }

        var storagePlan = await _storagePlanRepository.GetByIdAsync(subscription.Storageplanid, cancellationToken);

        if (storagePlan is null)
        {
            throw new InvalidOperationException("Storage plan associated with the subscription was not found.");
        }

        if (storagePlan.Billingcycle <= 0)
        {
            throw new InvalidOperationException("The subscription has an invalid billing cycle.");
        }

        await _storageQuotaService.EnsureSubscriptionAllocationSufficientAsync(userId, storagePlan.Storagesizegb, cancellationToken);

        // Server determines the payment amount.
        request.Payment.Amount =storagePlan.Price;

        var paymentResult = await _paymentService.ProcessPaymentAsync(request.Payment, cancellationToken);

        if (!paymentResult.IsSuccessful)
        {
            throw new InvalidOperationException(paymentResult.Message);
        }

        var wasActive = subscription.Status == ActiveStatus && subscription.Enddate > now;

        if (wasActive)
        {
            // Preserve remaining paid time.
            subscription.Enddate =subscription.Enddate.AddMonths(storagePlan.Billingcycle);
        }
        else
        {
            // Renewal from cancellation/expiry grace period.
            subscription.Startdate = now;

            subscription.Enddate = now.AddMonths(storagePlan.Billingcycle);
        }

        subscription.Status = ActiveStatus;

        subscription.Graceperiodenddate = null;

        _subscriptionRepository.Update(subscription);

        await _additionalStoragePurchaseService.ActivatePurchasesAsync(userId, cancellationToken);

        await _storageQuotaService.SetAllocatedStorageForActiveSubscriptionAsync(userId, storagePlan.Storagesizegb, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        subscription.Storageplan = storagePlan;

        return _mapper.Map<SubscriptionResponseDto>(subscription);
    }

    public async Task<SubscriptionResponseDto> CancelAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var subscriptions = await _subscriptionRepository.GetByUserIdAsync(userId, cancellationToken);

        var activeSubscription = subscriptions.FirstOrDefault(s => s.Status == ActiveStatus);

        if (activeSubscription is null)
        {
            throw new InvalidOperationException("You do not have an active subscription to cancel.");
        }

        activeSubscription.Status = CancelledStatus;

        activeSubscription.Graceperiodenddate =DateTime.UtcNow.AddDays(GracePeriodDays);

        _subscriptionRepository.Update(activeSubscription);

        // Cancellation of the base subscription
        // deactivates all additional storage purchases.
        await _additionalStoragePurchaseService.DeactivatePurchasesAsync(userId, cancellationToken);

        await _storageQuotaService.DeactivateStorageAllocationAsync(userId, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var storagePlan = await _storagePlanRepository.GetByIdAsync(activeSubscription.Storageplanid, cancellationToken);

        if (storagePlan is null)
        {
            throw new InvalidOperationException("Storage plan associated with the subscription was not found.");
        }

        activeSubscription.Storageplan = storagePlan;

        return _mapper.Map<SubscriptionResponseDto>(activeSubscription);
    }

    public async Task<int> ExpireDueSubscriptionsAsync(CancellationToken cancellationToken = default)
    {
        var subscriptions = await _subscriptionRepository.GetAllAsync(cancellationToken);

        var now = DateTime.UtcNow;

        var dueSubscriptions = subscriptions.Where(s => s.Status == ActiveStatus && s.Enddate <= now).ToList();

        foreach (var subscription in dueSubscriptions)
        {
            subscription.Status = ExpiredStatus;

            subscription.Graceperiodenddate =now.AddDays(GracePeriodDays);

            _subscriptionRepository.Update(subscription);

            await _additionalStoragePurchaseService.DeactivatePurchasesAsync(subscription.Userid, cancellationToken);

            await _storageQuotaService.DeactivateStorageAllocationAsync(subscription.Userid, cancellationToken);
        }

        if (dueSubscriptions.Count > 0)
        {
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return dueSubscriptions.Count;
    }

    public async Task<IEnumerable<SubscriptionResponseDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var subscriptions = await _subscriptionRepository.GetAllAsync(cancellationToken);

        return _mapper.Map<IEnumerable<SubscriptionResponseDto>>(subscriptions);
    }

    public async Task<SubscriptionResponseDto> GetByIdAsync(Guid subscriptionId, CancellationToken cancellationToken = default)
    {
        var subscription = await _subscriptionRepository.GetByIdAsync(subscriptionId, cancellationToken);

        if (subscription is null)
        {
            throw new KeyNotFoundException($"Subscription with ID '{subscriptionId}' was not found.");
        }

        return _mapper.Map<SubscriptionResponseDto>(subscription);
    }

    public async Task<IEnumerable<SubscriptionResponseDto>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var subscriptions = await _subscriptionRepository.GetByUserIdAsync(userId, cancellationToken);

        return _mapper.Map<IEnumerable<SubscriptionResponseDto>>(subscriptions);
    }
}