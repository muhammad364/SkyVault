using AutoMapper;
using System.Security.Cryptography;
using SkyVault.DTOs.Common.Responses;
using SkyVault.DTOs.ShareLink.Requests;
using SkyVault.DTOs.ShareLink.Responses;
using SkyVault.Models;
using SkyVault.Repository;
using SkyVault.Services.UserFileService;

namespace SkyVault.Services.ShareLinkService;

public class ShareLinkService : IShareLinkService
{
    private const int ShareTokenSizeBytes = 32;
    private const int MaxTokenGenerationAttempts = 5;

    private readonly IShareLinkRepository _shareLinkRepository;
    private readonly IUserFileRepository _userFileRepository;
    private readonly IUserFileService _userFileService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ShareLinkService(
        IShareLinkRepository shareLinkRepository,
        IUserFileRepository userFileRepository,
        IUserFileService userFileService,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _shareLinkRepository = shareLinkRepository;
        _userFileRepository = userFileRepository;
        _userFileService = userFileService;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ShareLinkDto> GenerateAsync(
        GenerateShareLinkRequestDto request,
        Guid ownerId,
        CancellationToken cancellationToken = default)
    {
        if (request is null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        if (request.FileId == Guid.Empty)
        {
            throw new InvalidOperationException("File ID is required.");
        }

        if (request.ExpiresAt.HasValue && request.ExpiresAt.Value <= DateTime.UtcNow)
        {
            throw new InvalidOperationException("Expiration date must be in the future.");
        }

        var file = await _userFileRepository.GetByIdAsync(
            request.FileId,
            cancellationToken);

        if (file is null || file.Ownerid != ownerId || file.Isdeleted)
        {
            throw new KeyNotFoundException("File not found.");
        }

        var shareToken = await GenerateUniqueTokenAsync(cancellationToken);

        var shareLink = new Sharelink
        {
            Sharelinkid = Guid.NewGuid(),
            Fileid = file.Fileid,
            Ownerid = ownerId,
            Sharetoken = shareToken,
            Expiresat = request.ExpiresAt,
            Isrevoked = false,
            Createdat = DateTime.UtcNow
        };

        await _shareLinkRepository.AddAsync(shareLink, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<ShareLinkDto>(shareLink);
    }

    public async Task<IEnumerable<ShareLinkDto>> GetOwnerLinksAsync(
        Guid ownerId,
        CancellationToken cancellationToken = default)
    {
        var shareLinks = await _shareLinkRepository.GetByOwnerIdAsync(
            ownerId,
            cancellationToken);

        var orderedLinks = shareLinks
            .OrderByDescending(link => link.Createdat);

        return _mapper.Map<IEnumerable<ShareLinkDto>>(orderedLinks);
    }

    public async Task<MessageResponseDto> RevokeAsync(
        Guid shareLinkId,
        Guid ownerId,
        CancellationToken cancellationToken = default)
    {
        if (shareLinkId == Guid.Empty)
        {
            throw new InvalidOperationException("Share link ID is required.");
        }

        var shareLink = await _shareLinkRepository.GetByIdAsync(
            shareLinkId,
            cancellationToken);

        if (shareLink is null || shareLink.Ownerid != ownerId)
        {
            throw new KeyNotFoundException("Share link not found.");
        }

        if (shareLink.Isrevoked)
        {
            return new MessageResponseDto
            {
                Message = "Share link is already revoked."
            };
        }

        shareLink.Isrevoked = true;

        _shareLinkRepository.Update(shareLink);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new MessageResponseDto
        {
            Message = "Share link revoked successfully."
        };
    }

    public async Task<(Stream Stream, string ContentType, string FileName)> PreviewByTokenAsync(
        string shareToken,
        CancellationToken cancellationToken = default)
    {
        var shareLink = await GetValidShareLinkAsync(
            shareToken,
            cancellationToken);

        var file = await GetSharedActiveFileAsync(
            shareLink.Fileid,
            cancellationToken);

        return await _userFileService.PreviewAsync(
            file.Fileid,
            file.Ownerid,
            cancellationToken);
    }

    public async Task<(Stream Stream, string ContentType, string FileName)> DownloadByTokenAsync(
        string shareToken,
        CancellationToken cancellationToken = default)
    {
        var shareLink = await GetValidShareLinkAsync(
            shareToken,
            cancellationToken);

        var file = await GetSharedActiveFileAsync(
            shareLink.Fileid,
            cancellationToken);

        return await _userFileService.DownloadAsync(
            file.Fileid,
            file.Ownerid,
            cancellationToken);
    }

    private async Task<Userfile> GetSharedActiveFileAsync(
        Guid fileId,
        CancellationToken cancellationToken)
    {
        var file = await _userFileRepository.GetByIdAsync(
            fileId,
            cancellationToken);

        if (file is null || file.Isdeleted)
        {
            throw new KeyNotFoundException("Shared file not found.");
        }

        return file;
    }

    private async Task<Sharelink> GetValidShareLinkAsync(
        string shareToken,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(shareToken))
        {
            throw new InvalidOperationException("Share token is required.");
        }

        var normalizedToken = shareToken.Trim();

        var shareLink = await _shareLinkRepository.GetByTokenAsync(
            normalizedToken,
            cancellationToken);

        if (shareLink is null)
        {
            throw new KeyNotFoundException("Share link is invalid.");
        }

        if (shareLink.Isrevoked)
        {
            throw new InvalidOperationException("Share link has been revoked.");
        }

        if (shareLink.Expiresat.HasValue && shareLink.Expiresat.Value <= DateTime.UtcNow)
        {
            throw new InvalidOperationException("Share link has expired.");
        }

        return shareLink;
    }

    private async Task<string> GenerateUniqueTokenAsync(CancellationToken cancellationToken)
    {
        for (var attempt = 0; attempt < MaxTokenGenerationAttempts; attempt++)
        {
            var candidateToken = GenerateSecureToken();

            var existingShareLink = await _shareLinkRepository.GetByTokenAsync(
                candidateToken,
                cancellationToken);

            if (existingShareLink is null)
            {
                return candidateToken;
            }
        }

        throw new InvalidOperationException(
            "Could not generate a unique share token.");
    }

    private static string GenerateSecureToken()
    {
        var tokenBytes = RandomNumberGenerator.GetBytes(ShareTokenSizeBytes);

        return Convert
            .ToBase64String(tokenBytes)
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');
    }
}
