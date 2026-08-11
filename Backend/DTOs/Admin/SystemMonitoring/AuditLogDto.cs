namespace SkyVault.DTOs.Admin;

public class AuditLogDto
{
    public Guid AuditLogId { get; set; }
    public Guid AdministratorId { get; set; }
    public string AdministratorEmail { get; set; } = null!;
    public string Action { get; set; } = null!;
    public string EntityType { get; set; } = null!;
    public Guid? EntityId { get; set; }
    public string Description { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}