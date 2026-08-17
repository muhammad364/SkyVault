using SkyVault.DTOs.Common.Responses;
using SkyVault.DTOs.ShareLink.Requests;
using SkyVault.DTOs.ShareLink.Responses;

namespace SkyVault.Services.ShareLinkService;

public interface IShareLinkService
{
    Task<ShareLinkDto> GenerateAsync(
        GenerateShareLinkRequestDto request,
        Guid ownerId,
        CancellationToken cancellationToken = default);

    Task<IEnumerable<ShareLinkDto>> GetOwnerLinksAsync(
        Guid ownerId,
        CancellationToken cancellationToken = default);

    Task<MessageResponseDto> RevokeAsync(
        Guid shareLinkId,
        Guid ownerId,
        CancellationToken cancellationToken = default);

    Task<(Stream Stream, string ContentType, string FileName)> PreviewByTokenAsync(
        string shareToken,
        CancellationToken cancellationToken = default);

    Task<(Stream Stream, string ContentType, string FileName)> DownloadByTokenAsync(
        string shareToken,
        CancellationToken cancellationToken = default);
}
