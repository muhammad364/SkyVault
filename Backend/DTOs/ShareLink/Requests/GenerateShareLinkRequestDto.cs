using System.ComponentModel.DataAnnotations;

namespace SkyVault.DTOs.ShareLink.Requests;

public class GenerateShareLinkRequestDto : IValidatableObject
{
    [Required]
    public Guid FileId { get; set; }

    public DateTime? ExpiresAt { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (FileId == Guid.Empty)
        {
            yield return new ValidationResult(
                "FileId is required.",
                new[] { nameof(FileId) });
        }

        if (ExpiresAt.HasValue && ExpiresAt.Value <= DateTime.UtcNow)
        {
            yield return new ValidationResult(
                "ExpiresAt must be in the future.",
                new[] { nameof(ExpiresAt) });
        }
    }
}
