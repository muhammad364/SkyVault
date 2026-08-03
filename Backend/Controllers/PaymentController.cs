using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyVault.DTOs.Payments;
using SkyVault.Services.StorageService.PaymentService;

namespace SkyVault.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost]
    public async Task<ActionResult<PaymentResponseDto>> ProcessPayment([FromBody] ProcessPaymentRequestDto request, CancellationToken cancellationToken)
    {
        var paymentResult = await _paymentService.ProcessPaymentAsync( request, cancellationToken);

        return Ok(paymentResult);
    }
}