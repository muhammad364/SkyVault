namespace SkyVault.DTOs.Folder.Responses;

public class FolderContentsResponseDto
{
    public Guid? CurrentFolderId { get; set; }

    public string CurrentFolderName { get; set; } = null!;

    public Guid? ParentFolderId { get; set; }

    public List<FolderSummaryDto> SubFolders { get; set; } = [];

    public List<FileSummaryDto> Files { get; set; } = [];
}