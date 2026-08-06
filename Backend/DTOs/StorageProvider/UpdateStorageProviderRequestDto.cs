using System.ComponentModel.DataAnnotations;

namespace SkyVault.DTOs.StorageProvider;

public class UpdateStorageProviderRequestDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = null!;
}