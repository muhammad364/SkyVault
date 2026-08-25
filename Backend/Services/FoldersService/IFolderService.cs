using SkyVault.DTOs.Common.Responses;
using SkyVault.DTOs.Folder.Requests;
using SkyVault.DTOs.Folder.Responses;

namespace SkyVault.Services.FoldersService;
public interface IFolderService
{
    Task<FolderResponseDto> CreateFolderAsync(CreateFolderRequestDto request, Guid userId, CancellationToken cancellationToken = default);

    Task<FolderContentsResponseDto> GetRootFolderAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<FolderContentsResponseDto> GetFolderAsync(Guid folderId, Guid userId, CancellationToken cancellationToken = default);

    Task<MessageResponseDto> RenameFolderAsync(Guid folderId, RenameFolderRequestDto request, Guid userId, CancellationToken cancellationToken = default);

    Task<MessageResponseDto> MoveFolderAsync(Guid folderId, MoveFolderRequestDto request, Guid userId, CancellationToken cancellationToken = default);

    Task<MessageResponseDto> DeleteFolderAsync(Guid folderId, Guid userId, CancellationToken cancellationToken = default);
}
