using System.ComponentModel.DataAnnotations;

namespace SkyVault.DTOs.Search.Requests;

public class SearchRequestDto : IValidatableObject
{
    public string? Query { get; set; }

    public string? FileType { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (FileType != null && FileType.Trim().Length == 0)
        {
            yield return new ValidationResult(
                "FileType cannot be empty.",
                new[] { nameof(FileType) });
        }

        if (FromDate.HasValue && ToDate.HasValue && FromDate.Value > ToDate.Value)
        {
            yield return new ValidationResult(
                "FromDate cannot be later than ToDate.",
                new[] { nameof(FromDate), nameof(ToDate) });
        }
    }
}
