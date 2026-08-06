using System.ComponentModel.DataAnnotations;

namespace SkyVault.DTOs.StorageAccount;

public class UpdateStorageAccountRequestDto
{
    [Required]
    [MaxLength(150)]
    public string AccountName { get; set; } = null!;

    [Range(1, long.MaxValue)]
    public long TotalCapacityBytes { get; set; }

    [Range(1, int.MaxValue)]
    public int Priority { get; set; }
}