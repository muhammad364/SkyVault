using System;

namespace SkyVault.Models;

public partial class Emailconfiguration
{
    public Guid Emailconfigurationid { get; set; }

    public string Smtphost { get; set; } = null!;

    public int Smtpport { get; set; }

    public bool Usessl { get; set; }

    public bool Requiresauthentication { get; set; }

    public string Senderemail { get; set; } = null!;

    public string? Senderdisplayname { get; set; }

    public string? Username { get; set; }

    public string? Encryptedpassword { get; set; }

    public bool Isactive { get; set; }

    public DateTime Createdat { get; set; }

    public DateTime Updatedat { get; set; }
}
