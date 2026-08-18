using SkyVault.DTOs.Common.Responses;
using SkyVault.DTOs.RecycleBin.Responses;
using SkyVault.Models;
using SkyVault.Repository;
using SkyVault.Services.PhysicalProviderService;
using SkyVault.Services.StorageAccount;
using SkyVault.Services.StorageQuotaService;

namespace SkyVault.Services.RecycleBinService;

public class RecycleBinService : IRecycleBinService
{
    private readonly IRecycleBinRepository _recycleBinRepository;
    private readonly IFolderRepository _folderRepository;
    private readonly IUserFileRepository _userFileRepository;
    private readonly IPhysicalStorageProvider _physicalStorageProvider;
    private readonly IStorageAccountService _storageAccountService;
    private readonly IStorageQuotaService _storageQuotaService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<RecycleBinService> _logger;
    private readonly TimeSpan _retentionPeriod;

    public RecycleBinService(
        IRecycleBinRepository recycleBinRepository,
        IFolderRepository folderRepository,
        IUserFileRepository userFileRepository,
        IPhysicalStorageProvider physicalStorageProvider,
        IStorageAccountService storageAccountService,
        IStorageQuotaService storageQuotaService,
        IUnitOfWork unitOfWork,
        IConfiguration configuration,
        ILogger<RecycleBinService> logger)
    {
        _recycleBinRepository = recycleBinRepository;
        _folderRepository = folderRepository;
        _userFileRepository = userFileRepository;
        _physicalStorageProvider = physicalStorageProvider;
        _storageAccountService = storageAccountService;
        _storageQuotaService = storageQuotaService;
        _unitOfWork = unitOfWork;
        _logger = logger;

        var retentionDays = configuration.GetValue<int?>("RecycleBin:RetentionDays") ?? 30;
        _retentionPeriod = TimeSpan.FromDays(retentionDays > 0 ? retentionDays : 30);
    }

    public async Task<IEnumerable<RecycleBinItemDto>> GetItemsAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var folders = await _recycleBinRepository.GetDeletedFoldersByOwnerAsync(
            userId,
            cancellationToken);
        var files = await _recycleBinRepository.GetDeletedFilesByOwnerAsync(
            userId,
            cancellationToken);

        return folders.Select(folder => new RecycleBinItemDto
            {
                ItemId = folder.Folderid,
                ItemType = "Folder",
                Name = folder.Name,
                OriginalParentFolderId = folder.Originalparentfolderid,
                DeletedAt = folder.Deletedat!.Value,
                ExpiresAt = folder.Deletedat.Value.Add(_retentionPeriod)
            })
            .Concat(files.Select(file => new RecycleBinItemDto
            {
                ItemId = file.Fileid,
                ItemType = "File",
                Name = file.Filename,
                OriginalParentFolderId = file.Folderid,
                Extension = file.Extension,
                MimeType = file.Mimetype,
                FileSizeBytes = file.Filesizebytes,
                DeletedAt = file.Deletedat!.Value,
                ExpiresAt = file.Deletedat.Value.Add(_retentionPeriod)
            }))
            .OrderByDescending(item => item.DeletedAt)
            .ThenBy(item => item.Name)
            .ToList();
    }

    public async Task<MessageResponseDto> RestoreFileAsync(
        Guid fileId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var file = await GetOwnedDeletedFileAsync(fileId, userId, cancellationToken);

        if (file.Folderid.HasValue)
        {
            var parentFolder = await _folderRepository.GetByIdAsync(
                file.Folderid.Value,
                cancellationToken);

            if (parentFolder is null || parentFolder.Ownerid != userId || parentFolder.Isdeleted)
            {
                file.Folderid = null;
            }
        }

        file.Isdeleted = false;
        file.Deletedat = null;
        file.Updatedat = DateTime.UtcNow;

        _userFileRepository.Update(file);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new MessageResponseDto { Message = "File restored successfully." };
    }

    public async Task<MessageResponseDto> RestoreFolderAsync(
        Guid folderId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var folder = await GetOwnedDeletedFolderAsync(folderId, userId, cancellationToken);
        var allFolders = await _folderRepository.GetByUserIdAsync(userId, cancellationToken);
        var foldersToRestore = GetFolderTree(folder, allFolders.Where(f => f.Isdeleted));
        var folderIds = foldersToRestore.Select(f => f.Folderid).ToHashSet();

        folder.Parentfolderid = await GetRestoredParentFolderIdAsync(
            folder.Originalparentfolderid,
            userId,
            cancellationToken);

        var restoredAt = DateTime.UtcNow;
        foreach (var folderToRestore in foldersToRestore)
        {
            folderToRestore.Isdeleted = false;
            folderToRestore.Deletedat = null;
            folderToRestore.Originalparentfolderid = null;
            folderToRestore.Updatedat = restoredAt;
            _folderRepository.Update(folderToRestore);
        }

        var files = await _recycleBinRepository.GetDeletedFilesByOwnerAsync(userId, cancellationToken);
        foreach (var file in files.Where(
                     f => f.Folderid.HasValue && folderIds.Contains(f.Folderid.Value)))
        {
            file.Isdeleted = false;
            file.Deletedat = null;
            file.Updatedat = restoredAt;
            _userFileRepository.Update(file);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new MessageResponseDto { Message = "Folder restored successfully." };
    }

    public async Task<MessageResponseDto> PermanentlyDeleteFileAsync(
        Guid fileId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var file = await GetOwnedDeletedFileAsync(fileId, userId, cancellationToken);
        await PermanentlyDeleteFileAsync(file, cancellationToken);

        return new MessageResponseDto { Message = "File permanently deleted successfully." };
    }

    public async Task<MessageResponseDto> PermanentlyDeleteFolderAsync(
        Guid folderId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var folder = await GetOwnedDeletedFolderAsync(folderId, userId, cancellationToken);
        var allFolders = await _folderRepository.GetByUserIdAsync(userId, cancellationToken);
        var foldersToDelete = GetFolderTree(folder, allFolders.Where(f => f.Isdeleted));
        var folderIds = foldersToDelete.Select(f => f.Folderid).ToHashSet();
        var deletedFiles = await _recycleBinRepository.GetDeletedFilesByOwnerAsync(userId, cancellationToken);

        foreach (var file in deletedFiles.Where(
                     f => f.Folderid.HasValue && folderIds.Contains(f.Folderid.Value)))
        {
            await PermanentlyDeleteFileAsync(file, cancellationToken);
        }

        foreach (var folderToDelete in foldersToDelete.OrderByDescending(
                     item => GetFolderDepth(item, allFolders)))
        {
            _folderRepository.Remove(folderToDelete);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new MessageResponseDto { Message = "Folder permanently deleted successfully." };
    }

    public async Task<int> DeleteExpiredItemsAsync(
        CancellationToken cancellationToken = default)
    {
        var expiryCutoff = DateTime.UtcNow.Subtract(_retentionPeriod);
        var expiredFolders = (await _recycleBinRepository.GetExpiredDeletedFoldersAsync(
            expiryCutoff,
            cancellationToken)).ToList();
        var expiredFolderIds = expiredFolders.Select(folder => folder.Folderid).ToHashSet();
        var expiredFiles = await _recycleBinRepository.GetExpiredDeletedFilesAsync(
            expiryCutoff,
            cancellationToken);
        var deletedCount = 0;

        foreach (var folder in expiredFolders.Where(folder =>
                     !folder.Parentfolderid.HasValue ||
                     !expiredFolderIds.Contains(folder.Parentfolderid.Value)))
        {
            try
            {
                await PermanentlyDeleteFolderAsync(folder.Folderid, folder.Ownerid, cancellationToken);
                deletedCount++;
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                _logger.LogError(ex, "Recycle Bin cleanup could not permanently delete folder {FolderId}.", folder.Folderid);
            }
        }

        foreach (var file in expiredFiles)
        {
            try
            {
                await PermanentlyDeleteFileAsync(file.Fileid, file.Ownerid, cancellationToken);
                deletedCount++;
            }
            catch (KeyNotFoundException)
            {
                // The file was deleted as part of an expired folder tree.
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                _logger.LogError(ex, "Recycle Bin cleanup could not permanently delete file {FileId}.", file.Fileid);
            }
        }

        return deletedCount;
    }

    private async Task PermanentlyDeleteFileAsync(Userfile file, CancellationToken cancellationToken)
    {
        await _physicalStorageProvider.DeleteAsync(
            file.Storageaccountid,
            file.Providerobjectid,
            cancellationToken);

        await _storageAccountService.ReleaseCapacityAsync(
            file.Storageaccountid,
            file.Filesizebytes,
            cancellationToken);

        await _storageQuotaService.ReleaseStorageAsync(
            file.Ownerid,
            file.Filesizebytes,
            cancellationToken);

        _userFileRepository.Remove(file);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task<Userfile> GetOwnedDeletedFileAsync(
        Guid fileId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        var file = await _userFileRepository.GetByIdAsync(fileId, cancellationToken);

        if (file is null || file.Ownerid != userId || !file.Isdeleted)
        {
            throw new KeyNotFoundException("Recycle Bin file not found.");
        }

        return file;
    }

    private async Task<Folder> GetOwnedDeletedFolderAsync(
        Guid folderId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        var folder = await _folderRepository.GetByIdAsync(folderId, cancellationToken);

        if (folder is null || folder.Ownerid != userId || !folder.Isdeleted)
        {
            throw new KeyNotFoundException("Recycle Bin folder not found.");
        }

        return folder;
    }

    private async Task<Guid?> GetRestoredParentFolderIdAsync(
        Guid? originalParentFolderId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        if (!originalParentFolderId.HasValue)
        {
            return null;
        }

        var parentFolder = await _folderRepository.GetByIdAsync(
            originalParentFolderId.Value,
            cancellationToken);

        return parentFolder is not null &&
               parentFolder.Ownerid == userId &&
               !parentFolder.Isdeleted
            ? parentFolder.Folderid
            : null;
    }

    private static List<Folder> GetFolderTree(
        Folder rootFolder,
        IEnumerable<Folder> folders)
    {
        var foldersByParentId = folders
            .Where(folder => folder.Parentfolderid.HasValue)
            .GroupBy(folder => folder.Parentfolderid!.Value)
            .ToDictionary(group => group.Key, group => group.ToList());
        var result = new List<Folder>();
        var pendingFolders = new Stack<Folder>();
        pendingFolders.Push(rootFolder);

        while (pendingFolders.Count > 0)
        {
            var currentFolder = pendingFolders.Pop();
            result.Add(currentFolder);

            if (foldersByParentId.TryGetValue(currentFolder.Folderid, out var childFolders))
            {
                foreach (var childFolder in childFolders)
                {
                    pendingFolders.Push(childFolder);
                }
            }
        }

        return result;
    }

    private static int GetFolderDepth(Folder folder, IEnumerable<Folder> folders)
    {
        var foldersById = folders.ToDictionary(item => item.Folderid);
        var depth = 0;
        var currentFolder = folder;

        while (currentFolder.Parentfolderid.HasValue &&
               foldersById.TryGetValue(currentFolder.Parentfolderid.Value, out var parentFolder))
        {
            depth++;
            currentFolder = parentFolder;
        }

        return depth;
    }
}
