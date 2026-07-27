using System;
using System.Collections.Generic;

namespace SkyVault.Models;

public partial class Storageprovider
{
    public Guid Providerid { get; set; }

    public string Name { get; set; } = null!;

    public string Providertype { get; set; } = null!;

    public bool Isactive { get; set; }

    public DateTime Createdat { get; set; }

    public virtual ICollection<Storageaccount> Storageaccounts { get; set; } = new List<Storageaccount>();
}
