using System;
using System.Collections.Generic;

namespace SkyVault.Models;

public partial class Subscription
{
    public Guid Subscriptionid { get; set; }

    public Guid Userid { get; set; }

    public Guid Storageplanid { get; set; }

    public DateTime Startdate { get; set; }

    public DateTime Enddate { get; set; }

    public short Status { get; set; }

    public DateTime? Graceperiodenddate { get; set; }

    public virtual Storageplan Storageplan { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
