using System;
using System.Collections.Generic;

namespace SkyVault.Models;

public partial class Userfile
{
    public Guid Fileid { get; set; }

    public Guid Ownerid { get; set; }

    public Guid? Folderid { get; set; }

    public Guid Storageaccountid { get; set; }

    public string Filename { get; set; } = null!;

    public string Extension { get; set; } = null!;

    public string Mimetype { get; set; } = null!;

    public long Filesizebytes { get; set; }

    public string Providerobjectid { get; set; } = null!;

    public bool Isdeleted { get; set; }

    public DateTime? Deletedat { get; set; }

    public DateTime Uploadedat { get; set; }

    public DateTime Updatedat { get; set; }

    public virtual Folder? Folder { get; set; } = null!;

    public virtual User Owner { get; set; } = null!;

    public virtual ICollection<Sharelink> Sharelinks { get; set; } = new List<Sharelink>();

    public virtual Storageaccount Storageaccount { get; set; } = null!;
}
