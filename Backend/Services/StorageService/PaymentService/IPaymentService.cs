using SkyVault.DTOs.Payments;

namespace SkyVault.Services.StorageService.PaymentService;

public interface IPaymentService
{
    Task<PaymentResponseDto> ProcessPaymentAsync(ProcessPaymentRequestDto request, CancellationToken cancellationToken = default);
}