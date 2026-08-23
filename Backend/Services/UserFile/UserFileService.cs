using AutoMapper;
using Microsoft.AspNetCore.Http;
using SkyVault.Configurations;
using SkyVault.DTOs.Common.Responses;
using SkyVault.DTOs.UserFile.Requests;
using SkyVault.DTOs.UserFile.Responses;
using SkyVault.DTOs.StorageAccount;
using SkyVault.Models;
using SkyVault.Repository;
using SkyVault.Services.PhysicalProviderService;
using SkyVault.Services.StorageAccount;
using SkyVault.Services.StorageQuotaService;

namespace SkyVault.Services.UserFileService;

public class UserFileService : IUserFileService
{
    private readonly IUserFileRepository _userFileRepository;
    private readonly IFolderRepository _folderRepository;
    private readonly IStorageQuotaService _storageQuotaService;
    private readonly IStorageAccountService _storageAccountService;
    private readonly IPhysicalStorageProvider _physicalStorageProvider;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;

    public UserFileService(
        IUserFileRepository userFileRepository,
        IFolderRepository folderRepository,
        IStorageQuotaService storageQuotaService,
        IStorageAccountService storageAccountService,
        IPhysicalStorageProvider physicalStorageProvider,
        IMapper mapper,
        IUnitOfWork unitOfWork)
    {
        _userFileRepository = userFileRepository;
        _folderRepository = folderRepository;
        _storageQuotaService = storageQuotaService;
        _storageAccountService = storageAccountService;
        _physicalStorageProvider = physicalStorageProvider;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
    }

    // ============================================================
    // UPLOAD
    // ============================================================

    public async Task<FileResponseDto> UploadAsync(
        UploadFileRequestDto request,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        ValidateUploadFile(request.File);

        await ValidateDestinationFolderAsync(
            request.FolderId,
            userId,
            cancellationToken);

        var originalFileName =
            Path.GetFileName(request.File.FileName);

        var fileName =
            await GenerateUniqueFileNameAsync(
                request.FolderId,
                originalFileName,
                cancellationToken);

        var requestedSize = request.File.Length;

        /*
         * First reserve the user's logical quota.
         * StorageQuotaService also verifies that the user has
         * an active account/subscription and sufficient quota.
         */
        await _storageQuotaService.ReserveStorageAsync(
            userId,
            requestedSize,
            cancellationToken);

        /*
         * Select an active physical storage account having
         * sufficient remaining capacity.
         */
        var storageAccount =
            await GetAvailableStorageAccountAsync(
                requestedSize,
                cancellationToken);

        /*
         * Reserve the requested physical capacity against
         * the exact account selected above.
         */
        await _storageAccountService.ReserveCapacityForAccountAsync(
            storageAccount.StorageAccountId,
            requestedSize,
            cancellationToken);

        await using var stream =
            request.File.OpenReadStream();

        /*
         * The provider is authoritative for the actual stored
         * file size and provider metadata.
         */
        var providerFile =
            await _physicalStorageProvider.UploadAsync(
                storageAccount.StorageAccountId,
                stream,
                fileName,
                request.File.ContentType,
                cancellationToken);

        if (providerFile.FileSizeBytes <= 0)
        {
            throw new InvalidOperationException(
                "The storage provider returned an invalid file size.");
        }

        /*
         * Reconcile logical quota against the actual provider size.
         */
        await ReconcileLogicalStorageAsync(
            userId,
            requestedSize,
            providerFile.FileSizeBytes,
            cancellationToken);

        /*
         * Reconcile physical account capacity against the actual
         * provider size.
         */
        await ReconcilePhysicalStorageAsync(
            storageAccount.StorageAccountId,
            requestedSize,
            providerFile.FileSizeBytes,
            cancellationToken);

        var userFile = new Userfile
        {
            Fileid = Guid.NewGuid(),

            Ownerid = userId,

            /*
             * null represents the user's root directory.
             */
            Folderid = request.FolderId,

            Storageaccountid =
                storageAccount.StorageAccountId,

            Filename =
                providerFile.FileName,

            Extension =
                Path.GetExtension(providerFile.FileName),

            Mimetype =
                providerFile.MimeType,

            Filesizebytes =
                providerFile.FileSizeBytes,

            Providerobjectid =
                providerFile.ProviderObjectId,

            Isdeleted = false,

            Deletedat = null,

            Uploadedat = DateTime.UtcNow,

            Updatedat = DateTime.UtcNow
        };

        await _userFileRepository.AddAsync(
            userFile,
            cancellationToken);

        await _unitOfWork.SaveChangesAsync(
            cancellationToken);

        return _mapper.Map<FileResponseDto>(userFile);
    }

    // ============================================================
    // LIST USER FILES
    // ============================================================

    public async Task<IEnumerable<FileResponseDto>> GetUserFilesAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var files =
            await _userFileRepository.GetByUserIdAsync(
                userId,
                cancellationToken);

        var activeFiles = files
            .Where(f => !f.Isdeleted)
            .OrderBy(f => f.Filename);

        return _mapper.Map<IEnumerable<FileResponseDto>>(
            activeFiles);
    }

    // ============================================================
    // LIST FILES IN FOLDER
    // ============================================================

    public async Task<IEnumerable<FileResponseDto>> GetByFolderIdAsync(
        Guid? folderId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        await ValidateDestinationFolderAsync(
            folderId,
            userId,
            cancellationToken);

        var files =
            await _userFileRepository.GetByFolderIdAsync(
                userId,
                folderId,
                cancellationToken);

        return _mapper.Map<IEnumerable<FileResponseDto>>(
            files);
    }

    // ============================================================
    // GET FILE
    // ============================================================

    public async Task<FileResponseDto> GetByIdAsync(
        Guid fileId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var file =
            await GetOwnedActiveFileAsync(
                fileId,
                userId,
                cancellationToken);

        return _mapper.Map<FileResponseDto>(file);
    }

    // ============================================================
    // DOWNLOAD
    // ============================================================

    public async Task<(Stream Stream, string ContentType, string FileName)>
        DownloadAsync(
            Guid fileId,
            Guid userId,
            CancellationToken cancellationToken = default)
    {
        var file =
            await GetOwnedActiveFileAsync(
                fileId,
                userId,
                cancellationToken);

        var stream =
            await _physicalStorageProvider.DownloadAsync(
                file.Storageaccountid,
                file.Providerobjectid,
                cancellationToken);

        return (
            stream,
            file.Mimetype,
            file.Filename);
    }

    // ============================================================
    // PREVIEW
    // ============================================================

    public async Task<(Stream Stream, string ContentType, string FileName)>
        PreviewAsync(
            Guid fileId,
            Guid userId,
            CancellationToken cancellationToken = default)
    {
        var file =
            await GetOwnedActiveFileAsync(
                fileId,
                userId,
                cancellationToken);

        var stream =
            await _physicalStorageProvider.DownloadAsync(
                file.Storageaccountid,
                file.Providerobjectid,
                cancellationToken);

        return (
            stream,
            file.Mimetype,
            file.Filename);
    }

    // ============================================================
    // RENAME
    // ============================================================

    public async Task<MessageResponseDto> RenameAsync(
        Guid fileId,
        RenameFileRequestDto request,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var file =
            await GetOwnedActiveFileAsync(
                fileId,
                userId,
                cancellationToken);

        var newName =
            Path.GetFileName(
                request.FileName.Trim());

        if (string.IsNullOrWhiteSpace(newName))
        {
            throw new InvalidOperationException(
                "File name is required.");
        }

        if (newName.Length > 255)
        {
            throw new InvalidOperationException(
                "File name cannot exceed 255 characters.");
        }

        if (string.Equals(
                file.Filename,
                newName,
                StringComparison.Ordinal))
        {
            return new MessageResponseDto
            {
                Message = "File renamed successfully."
            };
        }

        var exists =
            await _userFileRepository.ExistsAsync(
                file.Folderid,
                newName,
                cancellationToken);

        if (exists)
        {
            throw new InvalidOperationException(
                "A file with the same name already exists in the destination folder.");
        }

        file.Filename = newName;

        file.Extension =
            Path.GetExtension(newName);

        file.Updatedat =
            DateTime.UtcNow;

        _userFileRepository.Update(file);

        await _unitOfWork.SaveChangesAsync(
            cancellationToken);

        return new MessageResponseDto
        {
            Message = "File renamed successfully."
        };
    }

    // ============================================================
    // MOVE
    // ============================================================

    public async Task<MessageResponseDto> MoveAsync(
        Guid fileId,
        MoveFileRequestDto request,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var file =
            await GetOwnedActiveFileAsync(
                fileId,
                userId,
                cancellationToken);

        await ValidateDestinationFolderAsync(
            request.DestinationFolderId,
            userId,
            cancellationToken);

        if (file.Folderid ==
            request.DestinationFolderId)
        {
            return new MessageResponseDto
            {
                Message = "File moved successfully."
            };
        }

        var exists =
            await _userFileRepository.ExistsAsync(
                request.DestinationFolderId,
                file.Filename,
                cancellationToken);

        if (exists)
        {
            throw new InvalidOperationException(
                "A file with the same name already exists in the destination folder.");
        }

        file.Folderid =
            request.DestinationFolderId;

        file.Updatedat =
            DateTime.UtcNow;

        _userFileRepository.Update(file);

        await _unitOfWork.SaveChangesAsync(
            cancellationToken);

        return new MessageResponseDto
        {
            Message = "File moved successfully."
        };
    }

    // ============================================================
    // REPLACE
    // ============================================================

    public async Task<MessageResponseDto> ReplaceAsync(
        Guid fileId,
        ReplaceFileRequestDto request,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        ValidateUploadFile(request.File);

        var existingFile =
            await GetOwnedActiveFileAsync(
                fileId,
                userId,
                cancellationToken);

        var oldSize =
            existingFile.Filesizebytes;

        var requestedSize =
            request.File.Length;

        /*
         * Only the positive difference requires additional
         * logical and physical storage.
         */
        var requestedAdditionalBytes =
            Math.Max(
                0,
                requestedSize - oldSize);

        if (requestedAdditionalBytes > 0)
        {
            await _storageQuotaService.ReserveStorageAsync(
                userId,
                requestedAdditionalBytes,
                cancellationToken);

            /*
             * Replacement remains on the same physical storage
             * account as the existing file.
             */
            await _storageAccountService.ReserveCapacityForAccountAsync(
                existingFile.Storageaccountid,
                requestedAdditionalBytes,
                cancellationToken);
        }

        await using var stream =
            request.File.OpenReadStream();

        var providerFile =
            await _physicalStorageProvider.ReplaceAsync(
                existingFile.Storageaccountid,
                existingFile.Providerobjectid,
                stream,
                existingFile.Filename,
                request.File.ContentType,
                cancellationToken);

        if (providerFile.FileSizeBytes <= 0)
        {
            throw new InvalidOperationException(
                "The storage provider returned an invalid file size.");
        }

        var actualDelta =
            checked(
                providerFile.FileSizeBytes -
                oldSize);

        /*
         * Adjust the logical quota from the requested reservation
         * to the provider's actual size difference.
         */
        await ReconcileLogicalStorageAsync(
            userId,
            requestedAdditionalBytes,
            Math.Max(0, actualDelta),
            cancellationToken);

        /*
         * Adjust physical capacity in the same way.
         */
        await ReconcilePhysicalStorageAsync(
            existingFile.Storageaccountid,
            requestedAdditionalBytes,
            Math.Max(0, actualDelta),
            cancellationToken);

        existingFile.Extension =
            Path.GetExtension(request.File.FileName);

        existingFile.Mimetype =
            providerFile.MimeType;

        existingFile.Filesizebytes =
            providerFile.FileSizeBytes;

        existingFile.Updatedat =
            DateTime.UtcNow;

        _userFileRepository.Update(existingFile);

        await _unitOfWork.SaveChangesAsync(
            cancellationToken);

        return new MessageResponseDto
        {
            Message = "File replaced successfully."
        };
    }

    // ============================================================
    // COPY
    // ============================================================

    public async Task<IEnumerable<FileResponseDto>> CopyAsync(
        CopyFileRequestDto request,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        if (request.FileIds is null ||
            request.FileIds.Count == 0)
        {
            throw new InvalidOperationException(
                "At least one file must be selected for copying.");
        }

        await ValidateDestinationFolderAsync(
            request.DestinationFolderId,
            userId,
            cancellationToken);

        var distinctFileIds =
            request.FileIds
                .Distinct()
                .ToList();

        var sourceFiles = new List<Userfile>();

        foreach (var fileId in distinctFileIds)
        {
            var sourceFile = await GetOwnedActiveFileAsync(
                    fileId,
                    userId,
                    cancellationToken);

            sourceFiles.Add(sourceFile);
        }

        var createdFiles =
            new List<Userfile>();

        foreach (var sourceFile in sourceFiles)
        {
            var newFileName =
                await GenerateUniqueFileNameAsync(
                    request.DestinationFolderId,
                    sourceFile.Filename,
                    cancellationToken);

            /*
             * A copy is a new physical object and therefore
             * consumes additional logical quota.
             */
            await _storageQuotaService.ReserveStorageAsync(
                userId,
                sourceFile.Filesizebytes,
                cancellationToken);

            /*
             * The copy remains on the source file's physical
             * storage account.
             */
            await _storageAccountService.ReserveCapacityForAccountAsync(
                sourceFile.Storageaccountid,
                sourceFile.Filesizebytes,
                cancellationToken);

            /*
             * Direct provider-side copy.
             * No download/upload round trip is performed.
             */
            var copiedProviderFile =
                await _physicalStorageProvider.CopyAsync(
                    sourceFile.Storageaccountid,
                    sourceFile.Providerobjectid,
                    newFileName,
                    cancellationToken);

            if (copiedProviderFile.FileSizeBytes <= 0)
            {
                throw new InvalidOperationException(
                    "The storage provider returned an invalid copied file size.");
            }

            /*
             * Reconcile both logical and physical reservations
             * against the provider's authoritative copied size.
             */
            await ReconcileLogicalStorageAsync(
                userId,
                sourceFile.Filesizebytes,
                copiedProviderFile.FileSizeBytes,
                cancellationToken);

            await ReconcilePhysicalStorageAsync(
                sourceFile.Storageaccountid,
                sourceFile.Filesizebytes,
                copiedProviderFile.FileSizeBytes,
                cancellationToken);

            var copiedFile = new Userfile
            {
                Fileid = Guid.NewGuid(),

                Ownerid = userId,

                Folderid =
                    request.DestinationFolderId,

                Storageaccountid =
                    sourceFile.Storageaccountid,

                Filename =
                    copiedProviderFile.FileName,

                Extension =
                    Path.GetExtension(
                        copiedProviderFile.FileName),

                Mimetype =
                    copiedProviderFile.MimeType,

                Filesizebytes =
                    copiedProviderFile.FileSizeBytes,

                Providerobjectid =
                    copiedProviderFile.ProviderObjectId,

                Isdeleted = false,

                Deletedat = null,

                Uploadedat = DateTime.UtcNow,

                Updatedat = DateTime.UtcNow
            };

            createdFiles.Add(copiedFile);
        }

        foreach (var createdFile in createdFiles)
        {
            await _userFileRepository.AddAsync(
                createdFile,
                cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(
            cancellationToken);

        return _mapper.Map<IEnumerable<FileResponseDto>>(
            createdFiles);
    }

    // ============================================================
    // SOFT DELETE
    // ============================================================

    public async Task<MessageResponseDto> DeleteAsync(
        Guid fileId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var file =
            await GetOwnedActiveFileAsync(
                fileId,
                userId,
                cancellationToken);

        /*
         * The provider object is deliberately NOT deleted.
         *
         * Recycle Bin files continue consuming storage until
         * permanent deletion is performed by the Recycle Bin module.
         */
        file.Isdeleted = true;

        file.Deletedat =
            DateTime.UtcNow;

        file.Updatedat =
            DateTime.UtcNow;

        _userFileRepository.Update(file);

        await _unitOfWork.SaveChangesAsync(
            cancellationToken);

        return new MessageResponseDto
        {
            Message = "File moved to recycle bin successfully."
        };
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================

    private async Task<Userfile> GetOwnedActiveFileAsync(
        Guid fileId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        var file =
            await _userFileRepository.GetByIdAsync(
                fileId,
                cancellationToken);

        if (file is null ||
            file.Ownerid != userId ||
            file.Isdeleted)
        {
            throw new KeyNotFoundException(
                "File not found.");
        }

        return file;
    }

    private async Task ValidateDestinationFolderAsync(
        Guid? folderId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        /*
         * null represents the user's root directory.
         */
        if (!folderId.HasValue)
        {
            return;
        }

        var folder =
            await _folderRepository.GetByIdAsync(
                folderId.Value,
                cancellationToken);

        if (folder is null ||
            folder.Ownerid != userId ||
            folder.Isdeleted)
        {
            throw new KeyNotFoundException(
                "Destination folder not found.");
        }
    }

    private async Task<string> GenerateUniqueFileNameAsync(
        Guid? folderId,
        string originalFileName,
        CancellationToken cancellationToken)
    {
        originalFileName =
            Path.GetFileName(
                originalFileName).Trim();

        if (string.IsNullOrWhiteSpace(originalFileName))
        {
            throw new InvalidOperationException(
                "A valid file name is required.");
        }

        if (originalFileName.Length > 255)
        {
            throw new InvalidOperationException(
                "File name cannot exceed 255 characters.");
        }

        var extension =
            Path.GetExtension(
                originalFileName);

        var baseName =
            Path.GetFileNameWithoutExtension(
                originalFileName);

        var candidate =
            originalFileName;

        var counter = 1;

        while (await _userFileRepository.ExistsAsync(
                   folderId,
                   candidate,
                   cancellationToken))
        {
            candidate =
                $"{baseName} ({counter}){extension}";

            counter++;
        }

        return candidate;
    }

    private async Task<StorageAccountResponseDto>
        GetAvailableStorageAccountAsync(
            long requestedBytes,
            CancellationToken cancellationToken)
    {
        if (requestedBytes <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(requestedBytes),
                "Requested storage capacity must be greater than zero.");
        }

        var storageAccounts =
            await _storageAccountService.GetAllAsync(
                true,
                cancellationToken);

        var availableAccount =
            storageAccounts
                .Where(account =>
                    account.IsActive &&
                    account.AvailableCapacityBytes >= requestedBytes)
                .OrderBy(account => account.Priority)
                .ThenByDescending(account => account.AvailableCapacityBytes)
                .FirstOrDefault();

        if (availableAccount is null)
        {
            throw new InvalidOperationException(
                "No active storage account has sufficient physical storage capacity.");
        }

        return availableAccount;
    }

    private static void ValidateUploadFile(
        IFormFile file)
    {
        if (file is null)
        {
            throw new InvalidOperationException(
                "A file is required.");
        }

        if (file.Length <= 0)
        {
            throw new InvalidOperationException(
                "Empty files cannot be uploaded.");
        }

        if (file.Length > FileUploadLimits.MaxFileSizeBytes)
        {
            throw new InvalidOperationException(
                "The maximum supported file size is 100 MB.");
        }

        var fileName =
            Path.GetFileName(file.FileName);

        if (string.IsNullOrWhiteSpace(fileName))
        {
            throw new InvalidOperationException(
                "A valid file name is required.");
        }

        if (fileName.Length > 255)
        {
            throw new InvalidOperationException(
                "File name cannot exceed 255 characters.");
        }
    }

    private async Task ReconcileLogicalStorageAsync(
        Guid userId,
        long reservedBytes,
        long actualBytes,
        CancellationToken cancellationToken)
    {
        if (reservedBytes == actualBytes)
        {
            return;
        }

        var delta =
            checked(actualBytes - reservedBytes);

        await _storageQuotaService.AdjustUsedStorageAsync(
            userId,
            delta,
            cancellationToken);
    }

    private async Task ReconcilePhysicalStorageAsync(
        Guid storageAccountId,
        long reservedBytes,
        long actualBytes,
        CancellationToken cancellationToken)
    {
        if (reservedBytes == actualBytes)
        {
            return;
        }

        if (actualBytes > reservedBytes)
        {
            await _storageAccountService.ReserveCapacityForAccountAsync(
                storageAccountId,
                actualBytes - reservedBytes,
                cancellationToken);

            return;
        }

        await _storageAccountService.ReleaseCapacityAsync(
            storageAccountId,
            reservedBytes - actualBytes,
            cancellationToken);
    }
}
