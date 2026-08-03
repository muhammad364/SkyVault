using System.ComponentModel.DataAnnotations;
using SkyVault.DTOs.Payments;

namespace SkyVault.DTOs.Subscription;

public class SubscribeRequestDto
{
    [Required]
    public Guid StoragePlanId { get; set; }

    public bool ReplaceExistingSubscription { get; set; }

    [Required]
    public ProcessPaymentRequestDto Payment { get; set; } = null!;
}