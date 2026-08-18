using SkyVault.DTOs.Folder.Requests;
using SkyVault.DTOs.Folder.Responses;
using SkyVault.DTOs.Common.Responses;
using SkyVault.Repository;
using SkyVault.Models;
using AutoMapper;

namespace SkyVault.Services.FoldersService;

public class FolderService : IFolderService
{
    private readonly IFolderRepository _folderRepository;
    private readonly IUserFileRepository _userFileRepository;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;

    public FolderService(IFolderRepository folderRepository, IUserFileRepository userFileRepository, IMapper mapper, IUnitOfWork unitOfWork)
    {
        _folderRepository = folderRepository;
        _userFileRepository = userFileRepository;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
    }

    public async Task<FolderResponseDto> CreateFolderAsync(CreateFolderRequestDto request,Guid userId,CancellationToken cancellationToken = default)
    {
        if (request.ParentFolderId.HasValue)
        {
            var parentFolder = await _folderRepository.GetByIdAsync(request.ParentFolderId.Value, cancellationToken);

            if (parentFolder == null || parentFolder.Ownerid != userId || parentFolder.Isdeleted)
            {
                throw new KeyNotFoundException("Parent folder not found.");
            }
        }

        bool exists = await _folderRepository.ExistsAsync(userId, request.ParentFolderId, request.Name, cancellationToken);

        if (exists)
        {
            throw new InvalidOperationException("A folder with the same name already exists.");
        }

        var folder = new Folder
        {
            Folderid = Guid.NewGuid(),
            Ownerid = userId,
            Parentfolderid = request.ParentFolderId,
            Name = request.Name,
            Isdeleted = false,
            Deletedat = null,
            Originalparentfolderid = null,
            Createdat = DateTime.UtcNow,
            Updatedat = DateTime.UtcNow
        };

        await _folderRepository.AddAsync(folder, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<FolderResponseDto>(folder);
    }

    public async Task<FolderContentsResponseDto> GetRootFolderAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var folders = await _folderRepository.GetChildFoldersAsync(userId, null, cancellationToken);

        var files = await _userFileRepository.GetByFolderIdAsync(userId, null, cancellationToken);

        return new FolderContentsResponseDto
        {
            CurrentFolderId = null,
            CurrentFolderName = "Root",
            ParentFolderId = null,
            SubFolders = _mapper.Map<List<FolderSummaryDto>>(folders),
            Files = _mapper.Map<List<FileSummaryDto>>(files)
        };
    }
//Get
    public async Task<FolderContentsResponseDto> GetFolderAsync(Guid folderId, Guid userId, CancellationToken cancellationToken = default)
    {
        var folder = await _folderRepository.GetByIdAsync(folderId, cancellationToken);

        if (folder == null || folder.Ownerid != userId || folder.Isdeleted)
        {
            throw new KeyNotFoundException("Folder not found.");
        }

        var childFolders = await _folderRepository.GetChildFoldersAsync(userId, folderId, cancellationToken);

        var files = await _userFileRepository.GetByFolderIdAsync(userId, folderId, cancellationToken);

        return new FolderContentsResponseDto
        {
            CurrentFolderId = folder.Folderid,
            CurrentFolderName = folder.Name,
            ParentFolderId = folder.Parentfolderid,
            SubFolders = _mapper.Map<List<FolderSummaryDto>>(childFolders),
            Files = _mapper.Map<List<FileSummaryDto>>(files)
        };
    }

    public async Task<MessageResponseDto> RenameFolderAsync(Guid folderId, RenameFolderRequestDto request, Guid userId, CancellationToken cancellationToken = default)
    {
        var folder = await _folderRepository.GetByIdAsync(folderId, cancellationToken);

        if (folder == null || folder.Ownerid != userId || folder.Isdeleted)
        {
            throw new KeyNotFoundException("Folder not found.");
        }

        bool exists = await _folderRepository.ExistsAsync(userId, folder.Parentfolderid, request.Name, cancellationToken);

        if (exists && !string.Equals(folder.Name, request.Name, StringComparison.Ordinal))
        {
            throw new InvalidOperationException("A folder with the same name already exists.");
        }

        folder.Name = request.Name;
        folder.Updatedat = DateTime.UtcNow;

        _folderRepository.Update(folder);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new MessageResponseDto
        {
            Message = "Folder renamed successfully."
        };
    }

    public async Task<MessageResponseDto> DeleteFolderAsync(Guid folderId, Guid userId, CancellationToken cancellationToken = default)
    {
        var folder = await _folderRepository.GetByIdAsync(folderId, cancellationToken);

        if (folder == null || folder.Ownerid != userId || folder.Isdeleted)
        {
            throw new KeyNotFoundException("Folder not found.");
        }

        var deletedAt = DateTime.UtcNow;

        var allFolders = await _folderRepository.GetByUserIdAsync(
            userId,
            cancellationToken);

        var foldersByParentId = allFolders
            .Where(f => f.Parentfolderid.HasValue)
            .GroupBy(f => f.Parentfolderid)
            .ToDictionary(group => group.Key!.Value, group => group.ToList());

        var foldersToDelete = GetFolderTree(folder, foldersByParentId);
        var folderIds = foldersToDelete
            .Select(f => f.Folderid)
            .ToHashSet();

        var userFiles = await _userFileRepository.GetByUserIdAsync(
            userId,
            cancellationToken);

        foreach (var folderToDelete in foldersToDelete)
        {
            folderToDelete.Isdeleted = true;
            folderToDelete.Deletedat = deletedAt;
            folderToDelete.Originalparentfolderid = folderToDelete.Parentfolderid;
            folderToDelete.Updatedat = deletedAt;

            /*
             * Only detach the selected root folder. Descendants retain
             * their parent relationships so that restoration can rebuild
             * the hierarchy without additional location tracking.
             */
            if (folderToDelete.Folderid == folder.Folderid)
            {
                folderToDelete.Parentfolderid = null;
            }

            _folderRepository.Update(folderToDelete);
        }

        foreach (var userFile in userFiles.Where(
                     f => f.Folderid.HasValue &&
                          folderIds.Contains(f.Folderid.Value)))
        {
            userFile.Isdeleted = true;
            userFile.Deletedat = deletedAt;
            userFile.Updatedat = deletedAt;

            _userFileRepository.Update(userFile);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new MessageResponseDto
        {
            Message = "Folder moved to recycle bin successfully."
        };
    }

    private static List<Folder> GetFolderTree(
        Folder rootFolder,
        IReadOnlyDictionary<Guid, List<Folder>> foldersByParentId)
    {
        var folders = new List<Folder>();
        var foldersToVisit = new Stack<Folder>();

        foldersToVisit.Push(rootFolder);

        while (foldersToVisit.Count > 0)
        {
            var currentFolder = foldersToVisit.Pop();
            folders.Add(currentFolder);

            if (!foldersByParentId.TryGetValue(
                    currentFolder.Folderid,
                    out var childFolders))
            {
                continue;
            }

            foreach (var childFolder in childFolders)
            {
                foldersToVisit.Push(childFolder);
            }
        }

        return folders;
    }

    public async Task<MessageResponseDto> MoveFolderAsync(Guid folderId, MoveFolderRequestDto request, Guid userId, CancellationToken cancellationToken = default)
    {
        var sourceFolder = await _folderRepository.GetByIdAsync(folderId, cancellationToken);

        if (sourceFolder == null || sourceFolder.Ownerid != userId || sourceFolder.Isdeleted)
        {
            throw new KeyNotFoundException("Folder not found.");
        }

        Folder? destinationFolder = null;

        if (request.DestinationFolderId.HasValue)
        {
            destinationFolder = await _folderRepository.GetByIdAsync(request.DestinationFolderId.Value, cancellationToken);

            if (destinationFolder == null || destinationFolder.Ownerid != userId ||
                destinationFolder.Isdeleted)
            {
                throw new KeyNotFoundException("Destination folder not found.");
            }

            // Cannot move into itself
            if (destinationFolder.Folderid == sourceFolder.Folderid)
            {
                throw new InvalidOperationException("A folder cannot be moved into itself.");
            }

            // Prevent moving into a descendant
            var current = destinationFolder;

            while (current.Parentfolderid != null)
            {
                if (current.Parentfolderid == sourceFolder.Folderid)
                {
                    throw new InvalidOperationException(
                        "A folder cannot be moved into one of its descendants.");
                }
    
                var parent = await _folderRepository.GetByIdAsync(
                    current.Parentfolderid.Value,
                    cancellationToken);
    
                if (parent == null)
                {
                    break;
                }
    
                current = parent;
            }
        }

        bool exists = await _folderRepository.ExistsAsync(userId, request.DestinationFolderId, sourceFolder.Name, cancellationToken);

        if (exists && sourceFolder.Parentfolderid != request.DestinationFolderId)
        {
            throw new InvalidOperationException("A folder with the same name already exists.");
        }

        sourceFolder.Parentfolderid = request.DestinationFolderId;
        sourceFolder.Updatedat = DateTime.UtcNow;

        _folderRepository.Update(sourceFolder);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new MessageResponseDto
        {
            Message = "Folder moved successfully."
        };
    }
    }
