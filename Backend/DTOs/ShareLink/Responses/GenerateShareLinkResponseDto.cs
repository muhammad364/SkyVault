namespace SkyVault.DTOs.ShareLink.Responses;

public class GenerateShareLinkResponseDto
{
    public Guid ShareLinkId { get; set; }

    public Guid FileId { get; set; }

    public string ShareUrl { get; set; } = null!;

    public DateTime? ExpiresAt { get; set; }

    public bool IsRevoked { get; set; }

    public DateTime CreatedAt { get; set; }
}
