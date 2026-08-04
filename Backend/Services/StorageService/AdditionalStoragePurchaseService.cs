using AutoMapper;
using SkyVault.DTOs.AdditionalStoragePurchase;
using SkyVault.Models;
using SkyVault.Repository;
using SkyVault.Services.StorageService.PaymentService;

namespace SkyVault.Services.SubscriptionService;

public class AdditionalStoragePurchaseService : IAdditionalStoragePurchaseService
{
    private const short ActiveStatus = 0;
    private const short InactiveStatus = 1;

    private readonly IAdditionalStoragePurchaseRepository
        _purchaseRepository;

    private readonly ISubscriptionRepository
        _subscriptionRepository;

    private readonly IStoragePlanRepository
        _storagePlanRepository;

    private readonly IPaymentService
        _paymentService;

    private readonly IMapper
        _mapper;

    private readonly IUnitOfWork
        _unitOfWork;

    public AdditionalStoragePurchaseService(
        IAdditionalStoragePurchaseRepository purchaseRepository,
        ISubscriptionRepository subscriptionRepository,
        IStoragePlanRepository storagePlanRepository,
        IPaymentService paymentService,
        IMapper mapper,
        IUnitOfWork unitOfWork)
    {
        _purchaseRepository = purchaseRepository;
        _subscriptionRepository = subscriptionRepository;
        _storagePlanRepository = storagePlanRepository;
        _paymentService = paymentService;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
    }

    public async Task<AdditionalStorageQuoteResponseDto> GetQuoteAsync(
        Guid userId,
        AdditionalStorageQuoteRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var activeSubscription =
            await GetActiveSubscriptionAsync(
                userId,
                cancellationToken);

        if (activeSubscription is null)
        {
            throw new InvalidOperationException(
                "You must have an active storage plan before purchasing additional storage.");
        }

        var storagePlan =
            await _storagePlanRepository.GetByIdAsync(
                activeSubscription.Storageplanid,
                cancellationToken);

        if (storagePlan is null)
        {
            throw new InvalidOperationException(
                "The storage plan associated with the active subscription was not found.");
        }

        if (storagePlan.Storagesizegb <= 0)
        {
            throw new InvalidOperationException(
                "The storage plan has an invalid storage size.");
        }

        var historicalPurchases =
            await _purchaseRepository.GetByUserIdAsync(
                userId,
                cancellationToken);

        var basePricePerGb =
            storagePlan.Price /
            storagePlan.Storagesizegb;

        var pricePerGb =
            Math.Round(
                basePricePerGb *
                (historicalPurchases.Count() + 1),
                2,
                MidpointRounding.AwayFromZero);

        var totalPrice =
            Math.Round(
                pricePerGb *
                request.StorageAmountGb,
                2,
                MidpointRounding.AwayFromZero);

        return new AdditionalStorageQuoteResponseDto
        {
            StorageAmountGb = request.StorageAmountGb,
            PricePerGb = pricePerGb,
            TotalPrice = totalPrice
        };
    }

    public async Task<PurchaseAdditionalStorageResponseDto> PurchaseAsync(
        Guid userId,
        PurchaseAdditionalStorageRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var quote = await GetQuoteAsync(
            userId,
            new AdditionalStorageQuoteRequestDto
            {
                StorageAmountGb = request.StorageAmountGb
            },
            cancellationToken);

        // The server determines the actual amount.
        // Any amount supplied by the client is ignored.
        request.Payment.Amount = quote.TotalPrice;

        var paymentResult =
            await _paymentService.ProcessPaymentAsync(
                request.Payment,
                cancellationToken);

        if (!paymentResult.IsSuccessful)
        {
            throw new InvalidOperationException(
                paymentResult.Message);
        }

        var purchase =
            _mapper.Map<Additionalstoragepurchase>(
                request);

        purchase.Userid = userId;
        purchase.Price = quote.TotalPrice;
        purchase.Purchasedate = DateTime.UtcNow;
        purchase.Status = ActiveStatus;

        await _purchaseRepository.AddAsync(
            purchase,
            cancellationToken);

        await _unitOfWork.SaveChangesAsync(
            cancellationToken);

        return _mapper.Map<PurchaseAdditionalStorageResponseDto>(
            purchase);
    }

    public async Task<IEnumerable<PurchaseAdditionalStorageResponseDto>>
        GetCurrentUserPurchasesAsync(
            Guid userId,
            CancellationToken cancellationToken = default)
    {
        var purchases =
            await _purchaseRepository.GetByUserIdAsync(
                userId,
                cancellationToken);

        return _mapper.Map<
            IEnumerable<PurchaseAdditionalStorageResponseDto>>(
                purchases);
    }

    public async Task ActivatePurchasesAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var purchases =
            await _purchaseRepository.GetByUserIdAsync(
                userId,
                cancellationToken);

        foreach (var purchase in purchases)
        {
            purchase.Status = ActiveStatus;
        }

        // Intentionally do not call SaveChangesAsync here.
        // SubscriptionService owns the complete lifecycle transaction.
    }

    public async Task DeactivatePurchasesAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var purchases =
            await _purchaseRepository.GetByUserIdAsync(
                userId,
                cancellationToken);

        foreach (var purchase in purchases)
        {
            purchase.Status = InactiveStatus;
        }

        // Intentionally do not call SaveChangesAsync here.
        // SubscriptionService owns the complete lifecycle transaction.
    }

    private async Task<Subscription?> GetActiveSubscriptionAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        var subscriptions =
            await _subscriptionRepository.GetByUserIdAsync(
                userId,
                cancellationToken);

        return subscriptions.FirstOrDefault(
            s => s.Status == ActiveStatus);
    }
}