using System;
using System.Collections.Generic;

namespace SkyVault.Models;

public partial class Storageplan
{
    public Guid Storageplanid { get; set; }

    public string Name { get; set; } = null!;

    public int Storagesizegb { get; set; }

    public decimal Price { get; set; }

    public short Billingcycle { get; set; }

    public bool Isactive { get; set; }

    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
