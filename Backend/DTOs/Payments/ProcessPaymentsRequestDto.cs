using System.ComponentModel.DataAnnotations;

using System.Text.Json.Serialization;

namespace SkyVault.DTOs.Payments;

public class ProcessPaymentRequestDto
{
    [Required]
    [MaxLength(100)]
    public string CardHolderName { get; set; } = null!;

    [Required]
    [RegularExpression(@"^[0-9\s-]+$",ErrorMessage = "Card number can only contain digits, spaces, or hyphens.")]
    public string CardNumber { get; set; } = null!;

    [Range(1, 12)]
    public int ExpiryMonth { get; set; }

    [Range(2000, 2100)]
    public int ExpiryYear { get; set; }

    [Required]
    [RegularExpression(@"^\d{3,4}$", ErrorMessage = "CVV must contain 3 or 4 digits.")]
    public string Cvv { get; set; } = null!;


    [JsonIgnore]
    public decimal Amount { get; set; }
}