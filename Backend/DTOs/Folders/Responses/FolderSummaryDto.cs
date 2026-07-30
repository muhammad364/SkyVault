namespace SkyVault.DTOs.Folder.Responses;

public class FolderSummaryDto
{
    public Guid FolderId { get; set; }

    public Guid? ParentFolderId { get; set; }

    public string Name { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}