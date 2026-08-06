using System.ComponentModel.DataAnnotations;

namespace SkyVault.DTOs.StorageProvider;

public class CreateStorageProviderRequestDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = null!;

    [Required]
    [MaxLength(50)]
    public string ProviderType { get; set; } = null!;
}