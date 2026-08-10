using SkyVault.DTOs.Common.Responses;
using SkyVault.DTOs.UserFile.Requests;
using SkyVault.DTOs.UserFile.Responses;
using SkyVault.DTOs.Folder.Responses;

namespace SkyVault.Services.UserFileService;

public interface IUserFileService
{
    Task<FileResponseDto> UploadAsync(UploadFileRequestDto request,Guid userId,CancellationToken cancellationToken = default);

    Task<FileResponseDto> GetByIdAsync(Guid fileId,Guid userId,CancellationToken cancellationToken = default);

    Task<IEnumerable<FileSummaryDto>> GetByFolderIdAsync(Guid? folderId,Guid userId,CancellationToken cancellationToken = default);

    Task<Stream> DownloadAsync(Guid fileId,Guid userId,CancellationToken cancellationToken = default);

    Task<Stream> PreviewAsync(Guid fileId,Guid userId,CancellationToken cancellationToken = default);

    Task<MessageResponseDto> RenameAsync(Guid fileId,RenameFileRequestDto request,Guid userId,CancellationToken cancellationToken = default);

    Task<MessageResponseDto> MoveAsync(Guid fileId,MoveFileRequestDto request,Guid userId,CancellationToken cancellationToken = default);

    Task<FileResponseDto> ReplaceAsync(Guid fileId,ReplaceFileRequestDto request,Guid userId,CancellationToken cancellationToken = default);

    Task<FileResponseDto> CopyAsync(Guid fileId,CopyFileRequestDto request,Guid userId,CancellationToken cancellationToken = default);

    Task<MessageResponseDto> DeleteAsync(Guid fileId,Guid userId,CancellationToken cancellationToken = default);
}