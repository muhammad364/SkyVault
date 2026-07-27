using System;
using System.Collections.Generic;

namespace SkyVault.Models;

public partial class Additionalstoragepurchase
{
    public Guid Additionalstoragepurchaseid { get; set; }

    public Guid Userid { get; set; }

    public int Storageamountgb { get; set; }

    public decimal Price { get; set; }

    public DateTime Purchasedate { get; set; }

    public short Status { get; set; }

    public virtual User User { get; set; } = null!;
}
