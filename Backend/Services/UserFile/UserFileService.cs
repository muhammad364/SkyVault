using AutoMapper;
using SkyVault.DTOs.Common.Responses;
using SkyVault.DTOs.UserFile.Requests;
using SkyVault.DTOs.UserFile.Responses;
using SkyVault.DTOs.Folder.Responses;
using SkyVault.Models;
using SkyVault.Repository;
using SkyVault.Services.PhysicalProviderService;
using SkyVault.Services.StorageAccount;
using SkyVault.Services.StorageQuotaService;

namespace SkyVault.Services.UserFileService;

public class UserFileService : IUserFileService
{
    private const long MaxFileSizeBytes = 100L * 1024L * 1024L;

    private readonly IUserFileRepository _userFileRepository;
    private readonly IFolderRepository _folderRepository;
    private readonly IStorageAccountService _storageAccountService;
    private readonly IStorageQuotaService _storageQuotaService;
    private readonly IPhysicalStorageProvider _physicalStorageProvider;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;

    public UserFileService(
        IUserFileRepository userFileRepository,
        IFolderRepository folderRepository,
        IStorageAccountService storageAccountService,
        IStorageQuotaService storageQuotaService,
        IPhysicalStorageProvider physicalStorageProvider,
        IMapper mapper,
        IUnitOfWork unitOfWork)
    {
        _userFileRepository = userFileRepository;
        _folderRepository = folderRepository;
        _storageAccountService = storageAccountService;
        _storageQuotaService = storageQuotaService;
        _physicalStorageProvider = physicalStorageProvider;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
    }

    public async Task<FileResponseDto> UploadAsync(
        UploadFileRequestDto request,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        if (request.File is null || request.File.Length <= 0)
        {
            throw new InvalidOperationException("A valid file is required.");
        }

        if (request.File.Length > MaxFileSizeBytes)
        {
            throw new InvalidOperationException(
                "The maximum allowed file size is 100 MB.");
        }

        await ValidateDestinationFolderAsync(
            request.FolderId,
            userId,
            cancellationToken);

        var originalFileName = Path.GetFileName(request.File.FileName);

        if (string.IsNullOrWhiteSpace(originalFileName))
        {
            throw new InvalidOperationException("File name is required.");
        }

        var fileName = await GenerateUniqueFileNameAsync(
            request.FolderId,
            originalFileName,
            cancellationToken);

        var requestedSize = request.File.Length;

        await _storageQuotaService.ReserveStorageAsync(
            userId,
            requestedSize,
            cancellationToken);

        var storageAccount =
            await _storageAccountService.ReserveCapacityAsync(
                requestedSize,
                cancellationToken);

        var logicalQuotaReserved = true;
        var physicalCapacityReserved = true;
        var providerObjectId = string.Empty;

        try
        {
            await using var content = request.File.OpenReadStream();

            var providerResult =
                await _physicalStorageProvider.UploadAsync(
                    storageAccount.Storageaccountid,
                    content,
                    fileName,
                    request.File.ContentType,
                    cancellationToken);

            providerObjectId = providerResult.ProviderObjectId;

            var actualSize = providerResult.FileSizeBytes;

            await ReconcileStorageAsync(
                userId,
                storageAccount.Storageaccountid,
                requestedSize,
                actualSize,
                cancellationToken);

            logicalQuotaReserved = false;
            physicalCapacityReserved = false;

            var extension = Path.GetExtension(fileName);

            if (string.IsNullOrWhiteSpace(extension))
            {
                extension = string.Empty;
            }
            else
            {
                extension = extension.TrimStart('.');
            }

            var userFile = new Userfile
            {
                Fileid = Guid.NewGuid(),
                Ownerid = userId,
                Folderid = request.FolderId,
                Storageaccountid = storageAccount.Storageaccountid,
                Filename = fileName,
                Extension = extension,
                Mimetype = providerResult.MimeType
                            ?? request.File.ContentType
                            ?? "application/octet-stream",
                Filesizebytes = actualSize,
                Providerobjectid = providerResult.ProviderObjectId,
                Isdeleted = false,
                Deletedat = null,
                Uploadedat = providerResult.CreatedAt
                              ?? DateTime.UtcNow,
                Updatedat = providerResult.ModifiedAt
                              ?? DateTime.UtcNow
            };

            await _userFileRepository.AddAsync(
                userFile,
                cancellationToken);

            await _unitOfWork.SaveChangesAsync(
                cancellationToken);

            return _mapper.Map<FileResponseDto>(userFile);
        }
        catch
        {
            if (!string.IsNullOrWhiteSpace(providerObjectId))
            {
                try
                {
                    await _physicalStorageProvider.DeleteAsync(
                        storageAccount.Storageaccountid,
                        providerObjectId,
                        cancellationToken);
                }
                catch
                {
                    // Do not hide the original upload failure.
                }
            }

            if (physicalCapacityReserved)
            {
                try
                {
                    await _storageAccountService.ReleaseCapacityAsync(
                        storageAccount.Storageaccountid,
                        requestedSize,
                        cancellationToken);
                }
                catch
                {
                    // Preserve the original exception.
                }
            }

            if (logicalQuotaReserved)
            {
                try
                {
                    await _storageQuotaService.ReleaseStorageAsync(
                        userId,
                        requestedSize,
                        cancellationToken);
                }
                catch
                {
                    // Preserve the original exception.
                }
            }

            throw;
        }
    }

    public async Task<FileResponseDto> GetByIdAsync(
        Guid fileId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var file = await GetOwnedActiveFileAsync(
            fileId,
            userId,
            cancellationToken);

        return _mapper.Map<FileResponseDto>(file);
    }

    public async Task<IEnumerable<FileSummaryDto>> GetByFolderIdAsync(
        Guid? folderId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        if (folderId.HasValue)
        {
            await ValidateDestinationFolderAsync(
                folderId.Value,
                userId,
                cancellationToken);
        }

        var files = await _userFileRepository.GetByFolderIdAsync(
            userId,
            folderId,
            cancellationToken);

        return _mapper.Map<IEnumerable<FileSummaryDto>>(files);
    }

    public async Task<Stream> DownloadAsync(
        Guid fileId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var file = await GetOwnedActiveFileAsync(
            fileId,
            userId,
            cancellationToken);

        return await _physicalStorageProvider.DownloadAsync(
            file.Storageaccountid,
            file.Providerobjectid,
            cancellationToken);
    }

    public async Task<Stream> PreviewAsync(
        Guid fileId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var file = await GetOwnedActiveFileAsync(
            fileId,
            userId,
            cancellationToken);

        return await _physicalStorageProvider.DownloadAsync(
            file.Storageaccountid,
            file.Providerobjectid,
            cancellationToken);
    }

    public async Task<MessageResponseDto> RenameAsync(
        Guid fileId,
        RenameFileRequestDto request,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var file = await GetOwnedActiveFileAsync(
            fileId,
            userId,
            cancellationToken);

        var newName = Path.GetFileName(request.FileName);

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

        var exists = await _userFileRepository.ExistsAsync(
            file.Folderid,
            newName,
            cancellationToken);

        if (exists &&
            !string.Equals(
                file.Filename,
                newName,
                StringComparison.Ordinal))
        {
            newName = await GenerateUniqueFileNameAsync(
                file.Folderid,
                newName,
                cancellationToken);
        }

        file.Filename = newName;

        var extension = Path.GetExtension(newName);

        file.Extension = string.IsNullOrWhiteSpace(extension)
            ? string.Empty
            : extension.TrimStart('.');

        file.Updatedat = DateTime.UtcNow;

        _userFileRepository.Update(file);

        await _unitOfWork.SaveChangesAsync(
            cancellationToken);

        return new MessageResponseDto
        {
            Message = "File renamed successfully."
        };
    }

    public async Task<MessageResponseDto> MoveAsync(
        Guid fileId,
        MoveFileRequestDto request,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var file = await GetOwnedActiveFileAsync(
            fileId,
            userId,
            cancellationToken);

        await ValidateDestinationFolderAsync(
            request.DestinationFolderId,
            userId,
            cancellationToken);

        if (file.Folderid == request.DestinationFolderId)
        {
            return new MessageResponseDto
            {
                Message = "File is already in the selected folder."
            };
        }

        var destinationFileName =
            await GenerateUniqueFileNameAsync(
                request.DestinationFolderId,
                file.Filename,
                cancellationToken);

        file.Folderid = request.DestinationFolderId;
        file.Filename = destinationFileName;
        file.Updatedat = DateTime.UtcNow;

        _userFileRepository.Update(file);

        await _unitOfWork.SaveChangesAsync(
            cancellationToken);

        return new MessageResponseDto
        {
            Message = "File moved successfully."
        };
    }

    public async Task<FileResponseDto> ReplaceAsync(
        Guid fileId,
        ReplaceFileRequestDto request,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var existingFile = await GetOwnedActiveFileAsync(
            fileId,
            userId,
            cancellationToken);

        if (request.File is null || request.File.Length <= 0)
        {
            throw new InvalidOperationException(
                "A valid replacement file is required.");
        }

        if (request.File.Length > MaxFileSizeBytes)
        {
            throw new InvalidOperationException(
                "The maximum allowed file size is 100 MB.");
        }

        var requestedSize = request.File.Length;
        var previousSize = existingFile.Filesizebytes;

        var delta = checked(requestedSize - previousSize);

        if (delta > 0)
        {
            await _storageQuotaService.ReserveStorageAsync(
                userId,
                delta,
                cancellationToken);

            try
            {
                await _storageAccountService.ReserveCapacityForAccountAsync(
                    existingFile.Storageaccountid,
                    delta,
                    cancellationToken);
            }
            catch
            {
                await _storageQuotaService.ReleaseStorageAsync(
                    userId,
                    delta,
                    cancellationToken);

                throw;
            }
        }

        var additionalLogicalReservation = delta > 0;
        var additionalPhysicalReservation = delta > 0;

        try
        {
            await using var content = request.File.OpenReadStream();

            var providerResult =
                await _physicalStorageProvider.ReplaceAsync(
                    existingFile.Storageaccountid,
                    existingFile.Providerobjectid,
                    content,
                    existingFile.Filename,
                    request.File.ContentType,
                    cancellationToken);

            var actualSize = providerResult.FileSizeBytes;

            var actualDelta =
                checked(actualSize - previousSize);

            if (actualDelta > delta)
            {
                var extra = actualDelta - delta;

                await _storageQuotaService.ReserveStorageAsync(
                    userId,
                    extra,
                    cancellationToken);

                try
                {
                    await _storageAccountService
                        .ReserveCapacityForAccountAsync(
                            existingFile.Storageaccountid,
                            extra,
                            cancellationToken);
                }
                catch
                {
                    await _storageQuotaService.ReleaseStorageAsync(
                        userId,
                        extra,
                        cancellationToken);

                    throw;
                }
            }

            if (actualDelta < delta)
            {
                var excessReservation = delta - actualDelta;

                if (excessReservation > 0)
                {
                    await _storageQuotaService.ReleaseStorageAsync(
                        userId,
                        excessReservation,
                        cancellationToken);

                    await _storageAccountService.ReleaseCapacityAsync(
                        existingFile.Storageaccountid,
                        excessReservation,
                        cancellationToken);
                }
            }

            existingFile.Filesizebytes = actualSize;

            if (!string.IsNullOrWhiteSpace(
                    providerResult.MimeType))
            {
                existingFile.Mimetype =
                    providerResult.MimeType;
            }
            else if (!string.IsNullOrWhiteSpace(
                         request.File.ContentType))
            {
                existingFile.Mimetype =
                    request.File.ContentType;
            }

            existingFile.Updatedat =
                providerResult.ModifiedAt
                ?? DateTime.UtcNow;

            _userFileRepository.Update(existingFile);

            await _unitOfWork.SaveChangesAsync(
                cancellationToken);

            additionalLogicalReservation = false;
            additionalPhysicalReservation = false;

            return _mapper.Map<FileResponseDto>(
                existingFile);
        }
        catch
        {
            if (additionalPhysicalReservation)
            {
                try
                {
                    await _storageAccountService.ReleaseCapacityAsync(
                        existingFile.Storageaccountid,
                        delta,
                        cancellationToken);
                }
                catch
                {
                }
            }

            if (additionalLogicalReservation)
            {
                try
                {
                    await _storageQuotaService.ReleaseStorageAsync(
                        userId,
                        delta,
                        cancellationToken);
                }
                catch
                {
                }
            }

            throw;
        }
    }

    public async Task<FileResponseDto> CopyAsync(
        Guid fileId,
        CopyFileRequestDto request,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var sourceFile = await GetOwnedActiveFileAsync(
            fileId,
            userId,
            cancellationToken);

        await ValidateDestinationFolderAsync(
            request.DestinationFolderId,
            userId,
            cancellationToken);

        var destinationFileName =
            await GenerateUniqueFileNameAsync(
                request.DestinationFolderId,
                sourceFile.Filename,
                cancellationToken);

        var requestedSize = sourceFile.Filesizebytes;

        await _storageQuotaService.ReserveStorageAsync(
            userId,
            requestedSize,
            cancellationToken);

        var storageAccount =
            await _storageAccountService.ReserveCapacityAsync(
                requestedSize,
                cancellationToken);

        var logicalQuotaReserved = true;
        var physicalCapacityReserved = true;
        var providerObjectId = string.Empty;

        try
        {
            /*
             * IMPORTANT:
             * We do NOT download the original file.
             *
             * Google Drive copies the existing provider object directly.
             */
            var providerResult =
                await _physicalStorageProvider.CopyAsync(
                    storageAccount.Storageaccountid,
                    sourceFile.Providerobjectid,
                    destinationFileName,
                    cancellationToken);

            providerObjectId =
                providerResult.ProviderObjectId;

            var actualSize =
                providerResult.FileSizeBytes;

            await ReconcileStorageAsync(
                userId,
                storageAccount.Storageaccountid,
                requestedSize,
                actualSize,
                cancellationToken);

            logicalQuotaReserved = false;
            physicalCapacityReserved = false;

            var extension =
                Path.GetExtension(destinationFileName);

            extension = string.IsNullOrWhiteSpace(extension)
                ? string.Empty
                : extension.TrimStart('.');

            var copiedFile = new Userfile
            {
                Fileid = Guid.NewGuid(),
                Ownerid = userId,
                Storageaccountid =
                    storageAccount.Storageaccountid,
                Filename = destinationFileName,
                Extension = extension,
                Mimetype =
                    providerResult.MimeType
                    ?? sourceFile.Mimetype,
                Filesizebytes = actualSize,
                Providerobjectid =
                    providerResult.ProviderObjectId,
                Isdeleted = false,
                Deletedat = null,
                Uploadedat =
                    providerResult.CreatedAt
                    ?? DateTime.UtcNow,
                Updatedat =
                    providerResult.ModifiedAt
                    ?? DateTime.UtcNow
            };

            await _userFileRepository.AddAsync(
                copiedFile,
                cancellationToken);

            await _unitOfWork.SaveChangesAsync(
                cancellationToken);

            return _mapper.Map<FileResponseDto>(
                copiedFile);
        }
        catch
        {
            if (!string.IsNullOrWhiteSpace(providerObjectId))
            {
                try
                {
                    await _physicalStorageProvider.DeleteAsync(
                        storageAccount.Storageaccountid,
                        providerObjectId,
                        cancellationToken);
                }
                catch
                {
                }
            }

            if (physicalCapacityReserved)
            {
                try
                {
                    await _storageAccountService.ReleaseCapacityAsync(
                        storageAccount.Storageaccountid,
                        requestedSize,
                        cancellationToken);
                }
                catch
                {
                }
            }

            if (logicalQuotaReserved)
            {
                try
                {
                    await _storageQuotaService.ReleaseStorageAsync(
                        userId,
                        requestedSize,
                        cancellationToken);
                }
                catch
                {
                }
            }

            throw;
        }
    }

    public async Task<MessageResponseDto> DeleteAsync(
        Guid fileId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var file = await GetOwnedActiveFileAsync(
            fileId,
            userId,
            cancellationToken);

        file.Isdeleted = true;
        file.Deletedat = DateTime.UtcNow;
        file.Updatedat = DateTime.UtcNow;

        _userFileRepository.Update(file);

        await _unitOfWork.SaveChangesAsync(
            cancellationToken);

        return new MessageResponseDto
        {
            Message = "File moved to recycle bin successfully."
        };
    }

    private async Task<Userfile> GetOwnedActiveFileAsync(
        Guid fileId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        var file = await _userFileRepository.GetByIdAsync(
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
        if (!folderId.HasValue)
        {
            return;
        }

        var folder = await _folderRepository.GetByIdAsync(
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
        var extension = Path.GetExtension(originalFileName);

        var baseName = Path.GetFileNameWithoutExtension(
            originalFileName);

        if (string.IsNullOrWhiteSpace(baseName))
        {
            baseName = originalFileName;
        }

        var candidate = originalFileName;
        var counter = 1;

        while (await _userFileRepository.ExistsAsync(
                   folderId ?? Guid.Empty,
                   candidate,
                   cancellationToken))
        {
            candidate = $"{baseName} ({counter}){extension}";
            counter++;
        }

        return candidate;
    }

    private async Task ReconcileStorageAsync(
        Guid userId,
        Guid storageAccountId,
        long reservedBytes,
        long actualBytes,
        CancellationToken cancellationToken)
    {
        if (actualBytes <= 0)
        {
            throw new InvalidOperationException(
                "The storage provider returned an invalid file size.");
        }

        if (actualBytes == reservedBytes)
        {
            return;
        }

        if (actualBytes > reservedBytes)
        {
            var additionalBytes =
                checked(actualBytes - reservedBytes);

            await _storageQuotaService.ReserveStorageAsync(
                userId,
                additionalBytes,
                cancellationToken);

            try
            {
                await _storageAccountService
                    .ReserveCapacityForAccountAsync(
                        storageAccountId,
                        additionalBytes,
                        cancellationToken);
            }
            catch
            {
                await _storageQuotaService.ReleaseStorageAsync(
                    userId,
                    additionalBytes,
                    cancellationToken);

                throw;
            }

            return;
        }

        var excessBytes =
            checked(reservedBytes - actualBytes);

        await _storageQuotaService.ReleaseStorageAsync(
            userId,
            excessBytes,
            cancellationToken);

        await _storageAccountService.ReleaseCapacityAsync(
            storageAccountId,
            excessBytes,
            cancellationToken);
    }
}