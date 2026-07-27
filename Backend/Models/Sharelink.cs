using System;
using System.Collections.Generic;

namespace SkyVault.Models;

public partial class Sharelink
{
    public Guid Sharelinkid { get; set; }

    public Guid Fileid { get; set; }

    public Guid Ownerid { get; set; }

    public string Sharetoken { get; set; } = null!;

    public DateTime? Expiresat { get; set; }

    public bool Isrevoked { get; set; }

    public DateTime Createdat { get; set; }

    public virtual Userfile File { get; set; } = null!;

    public virtual User Owner { get; set; } = null!;
}
