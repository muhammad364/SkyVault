namespace SkyVault.DTOs.Payments;

public class PaymentResponseDto
{
    public bool IsSuccessful { get; set; }

    public Guid TransactionId { get; set; }

    public decimal Amount { get; set; }

    public string MaskedCardNumber { get; set; } = null!;

    public string Message { get; set; } = null!;

    public DateTime ProcessedAtUtc { get; set; }
}