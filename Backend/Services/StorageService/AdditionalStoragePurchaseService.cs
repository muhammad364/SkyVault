using AutoMapper;
using SkyVault.DTOs.AdditionalStoragePurchase;
using SkyVault.Services.StorageService.PaymentService;
using SkyVault.Models;
using SkyVault.Repository;

namespace SkyVault.Services.StorageService.AdditionalStoragePurchase;

public class AdditionalStoragePurchaseService : IAdditionalStoragePurchaseService
{
    private const short ActiveSubscriptionStatus = 0;
    private const short CompletedPurchaseStatus = 1;
    private const decimal PricePerGb = 100m;

    private readonly IAdditionalStoragePurchaseRepository _purchaseRepository;
    private readonly ISubscriptionRepository _subscriptionRepository;
    private readonly IPaymentService _paymentService;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;

    public AdditionalStoragePurchaseService(IAdditionalStoragePurchaseRepository purchaseRepository,ISubscriptionRepository subscriptionRepository,IPaymentService paymentService,IMapper mapper,IUnitOfWork unitOfWork)
    {
        _purchaseRepository = purchaseRepository;
        _subscriptionRepository = subscriptionRepository;
        _paymentService = paymentService;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
    }

    public async Task<PurchaseAdditionalStorageResponseDto> PurchaseAsync(Guid userId, PurchaseAdditionalStorageRequestDto request, CancellationToken cancellationToken = default)
    {
        var subscription = await _subscriptionRepository.GetByUserIdAsync(userId, cancellationToken);

        var activeSubscriptions = subscription.FirstOrDefault(s => s.Status == ActiveSubscriptionStatus);
        if (activeSubscriptions is null)
        {
            throw new InvalidOperationException("You must have an active storage plan before purchasing additional storage.");
        }

        var totalPrice = request.StorageAmountGb * PricePerGb;

        request.Payment.Amount = totalPrice;

        var paymentResult = await _paymentService.ProcessPaymentAsync(request.Payment, cancellationToken);

        if (!paymentResult.IsSuccessful)
        {
            throw new InvalidOperationException("Payment could not be processed.");
        }

        var purchase = _mapper.Map<Additionalstoragepurchase>(request);

        purchase.Userid = userId;
        purchase.Price = totalPrice;
        purchase.Purchasedate = DateTime.UtcNow;
        purchase.Status = CompletedPurchaseStatus;

        await _purchaseRepository.AddAsync(purchase, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<PurchaseAdditionalStorageResponseDto>(purchase);
    }

    public async Task<IEnumerable<PurchaseAdditionalStorageResponseDto>>
        GetCurrentUserPurchasesAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var purchases = await _purchaseRepository.GetByUserIdAsync(userId, cancellationToken);

        return _mapper.Map<IEnumerable<PurchaseAdditionalStorageResponseDto>>(purchases);
    }
}