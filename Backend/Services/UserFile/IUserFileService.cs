using SkyVault.DTOs.Common.Responses;
using SkyVault.DTOs.UserFile.Requests;
using SkyVault.DTOs.UserFile.Responses;

namespace SkyVault.Services.UserFileService;

public interface IUserFileService
{
    Task<FileResponseDto> UploadAsync(UploadFileRequestDto request, Guid userId, CancellationToken cancellationToken = default);

    Task<IEnumerable<FileResponseDto>> GetUserFilesAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<FileResponseDto> GetByIdAsync(Guid fileId, Guid userId, CancellationToken cancellationToken = default);

    Task<(Stream Stream, string ContentType, string FileName)> DownloadAsync(Guid fileId, Guid userId, CancellationToken cancellationToken = default);

    Task<(Stream Stream, string ContentType, string FileName)> PreviewAsync(Guid fileId, Guid userId, CancellationToken cancellationToken = default);

    Task<MessageResponseDto> RenameAsync(Guid fileId, RenameFileRequestDto request, Guid userId, CancellationToken cancellationToken = default);

    Task<MessageResponseDto> MoveAsync(Guid fileId, MoveFileRequestDto request, Guid userId, CancellationToken cancellationToken = default);

    Task<MessageResponseDto> ReplaceAsync(Guid fileId, ReplaceFileRequestDto request, Guid userId, CancellationToken cancellationToken = default);

    Task<IEnumerable<FileResponseDto>> CopyAsync(CopyFileRequestDto request, Guid userId, CancellationToken cancellationToken = default);

    Task<MessageResponseDto> DeleteAsync(Guid fileId, Guid userId, CancellationToken cancellationToken = default);
}
