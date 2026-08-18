using SkyVault.DTOs.Common.Responses;
using SkyVault.DTOs.RecycleBin.Responses;

namespace SkyVault.Services.RecycleBinService;

public interface IRecycleBinService
{
    Task<IEnumerable<RecycleBinItemDto>> GetItemsAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<MessageResponseDto> RestoreFileAsync(Guid fileId, Guid userId, CancellationToken cancellationToken = default);
    Task<MessageResponseDto> RestoreFolderAsync(Guid folderId, Guid userId, CancellationToken cancellationToken = default);
    Task<MessageResponseDto> PermanentlyDeleteFileAsync(Guid fileId, Guid userId, CancellationToken cancellationToken = default);
    Task<MessageResponseDto> PermanentlyDeleteFolderAsync(Guid folderId, Guid userId, CancellationToken cancellationToken = default);
    Task<int> DeleteExpiredItemsAsync(CancellationToken cancellationToken = default);
}
