using System;
using System.Collections.Generic;

namespace SkyVault.Models;

public partial class User
{
    public Guid Userid { get; set; }

    public string Firstname { get; set; } = null!;

    public string Lastname { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Passwordhash { get; set; } = null!;

    public bool Isemailverified { get; set; }

    public short Role { get; set; }

    public bool Isactive { get; set; }

    public long Allocatedstoragebytes { get; set; }

    public long Usedstoragebytes { get; set; }

    public DateTime Createdat { get; set; }

    public DateTime Updatedat { get; set; }

    public virtual ICollection<Additionalstoragepurchase> Additionalstoragepurchases { get; set; } = new List<Additionalstoragepurchase>();

    public virtual ICollection<Auditlog> Auditlogs { get; set; } = new List<Auditlog>();

    public virtual ICollection<Folder> Folders { get; set; } = new List<Folder>();

    public virtual ICollection<Sharelink> Sharelinks { get; set; } = new List<Sharelink>();

    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();

    public virtual ICollection<Userfile> Userfiles { get; set; } = new List<Userfile>();
}
