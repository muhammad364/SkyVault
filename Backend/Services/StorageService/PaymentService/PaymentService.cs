using SkyVault.DTOs.Payments;

namespace SkyVault.Services.StorageService.PaymentService;

public class PaymentService : IPaymentService
{
    public Task<PaymentResponseDto> ProcessPaymentAsync(ProcessPaymentRequestDto request, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var normalizedCardNumber = NormalizeCardNumber(request.CardNumber);

        ValidateCardNumber(normalizedCardNumber);

        ValidateCardHolderName(request.CardHolderName);

        ValidateExpiryDate(request.ExpiryMonth, request.ExpiryYear);

        ValidateCvv(request.Cvv);

        if (request.Amount <= 0)
        {
            throw new ArgumentException("Payment amount must be greater than zero.", nameof(request.Amount));
        }

        var paymentResponse = new PaymentResponseDto
        {
            IsSuccessful = true,
            TransactionId = Guid.NewGuid(),
            Amount = request.Amount,
            MaskedCardNumber = MaskCardNumber(normalizedCardNumber),
            Message = "Payment processed successfully.",
            ProcessedAtUtc = DateTime.UtcNow
        };

        return Task.FromResult(paymentResponse);
    }

    private static string NormalizeCardNumber(string cardNumber)
    {
        return cardNumber.Replace(" ", string.Empty) .Replace("-", string.Empty);
    }

    private static void ValidateCardNumber(string cardNumber)
    {
        if (cardNumber.Length < 13 || cardNumber.Length > 19)
        {
            throw new ArgumentException("Card number must contain between 13 and 19 digits.", nameof(cardNumber));
        }

        if (!cardNumber.All(char.IsDigit))
        {
            throw new ArgumentException( "Card number must contain digits only.", nameof(cardNumber));
        }

        if (!PassesLuhnCheck(cardNumber))
        {
            throw new ArgumentException("The provided card number is invalid.", nameof(cardNumber));
        }
    }

    private static void ValidateCardHolderName(string cardHolderName)
    {
        if (string.IsNullOrWhiteSpace(cardHolderName))
        {
            throw new ArgumentException("Card holder name is required.", nameof(cardHolderName));
        }
    }

    private static void ValidateExpiryDate(int expiryMonth, int expiryYear)
    {
        if (expiryMonth < 1 || expiryMonth > 12)
        {
            throw new ArgumentException("Expiry month must be between 1 and 12.", nameof(expiryMonth));
        }

        var expiryDate = new DateTime(expiryYear, expiryMonth, DateTime.DaysInMonth( expiryYear, expiryMonth), 23, 59, 59, DateTimeKind.Utc);

        if (expiryDate < DateTime.UtcNow)
        {
            throw new ArgumentException("The card has expired.", nameof(expiryYear));
        }
    }

    private static void ValidateCvv(string cvv)
    {
        if (string.IsNullOrWhiteSpace(cvv) || (cvv.Length != 3 && cvv.Length != 4) || !cvv.All(char.IsDigit))
        {
            throw new ArgumentException("CVV must contain 3 or 4 digits.", nameof(cvv));
        }
    }

    private static string MaskCardNumber(string cardNumber)
    {
        var lastFourDigits = cardNumber[^4..];

        return $"************{lastFourDigits}";
    }

    private static bool PassesLuhnCheck(string cardNumber)
    {
        var sum = 0;
        var shouldDouble = false;

        for (var i = cardNumber.Length - 1; i >= 0; i--)
        {
            var digit = cardNumber[i] - '0';

            if (shouldDouble)
            {
                digit *= 2;

                if (digit > 9)
                {
                    digit -= 9;
                }
            }

            sum += digit;

            shouldDouble = !shouldDouble;
        }

        return sum % 10 == 0;
    }
}