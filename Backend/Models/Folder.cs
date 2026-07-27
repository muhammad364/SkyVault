using System;
using System.Collections.Generic;

namespace SkyVault.Models;

public partial class Folder
{
    public Guid Folderid { get; set; }

    public Guid Ownerid { get; set; }

    public Guid? Parentfolderid { get; set; }

    public string Name { get; set; } = null!;

    public bool Isdeleted { get; set; }

    public DateTime? Deletedat { get; set; }

    public Guid? Originalparentfolderid { get; set; }

    public DateTime Createdat { get; set; }

    public DateTime Updatedat { get; set; }

    public virtual ICollection<Folder> InverseOriginalparentfolder { get; set; } = new List<Folder>();

    public virtual ICollection<Folder> InverseParentfolder { get; set; } = new List<Folder>();

    public virtual Folder? Originalparentfolder { get; set; }

    public virtual User Owner { get; set; } = null!;

    public virtual Folder? Parentfolder { get; set; }

    public virtual ICollection<Userfile> Userfiles { get; set; } = new List<Userfile>();
}
