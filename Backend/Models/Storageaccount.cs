using System;
using System.Collections.Generic;

namespace SkyVault.Models;

public partial class Storageaccount
{
    public Guid Storageaccountid { get; set; }

    public Guid Providerid { get; set; }

    public string Accountname { get; set; } = null!;

    public long Totalcapacitybytes { get; set; }

    public long Usedcapacitybytes { get; set; }

    public int Priority { get; set; }

    public bool Isactive { get; set; }

    public DateTime Createdat { get; set; }

    public virtual Storageprovider Provider { get; set; } = null!;

    public virtual ICollection<Userfile> Userfiles { get; set; } = new List<Userfile>();
}
