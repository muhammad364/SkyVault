using System.ComponentModel.DataAnnotations;
using SkyVault.DTOs.Payments;

namespace SkyVault.DTOs.Subscription;

public class RenewSubscriptionRequestDto
{
    [Required]
    public ProcessPaymentRequestDto Payment { get; set; } = null!;
}