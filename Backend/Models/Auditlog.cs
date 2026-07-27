using System;
using System.Collections.Generic;

namespace SkyVault.Models;

public partial class Auditlog
{
    public Guid Auditlogid { get; set; }

    public Guid Administratorid { get; set; }

    public string Action { get; set; } = null!;

    public string Entityname { get; set; } = null!;

    public Guid Entityid { get; set; }

    public string? Details { get; set; }

    public DateTime Performedat { get; set; }

    public virtual User Administrator { get; set; } = null!;
}
