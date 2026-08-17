using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using SkyVault.Models;

namespace SkyVault.Data;

public partial class SkyVaultDbContext : DbContext
{
    public SkyVaultDbContext()
    {
    }

    public SkyVaultDbContext(DbContextOptions<SkyVaultDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Additionalstoragepurchase> Additionalstoragepurchases { get; set; }

    public virtual DbSet<Auditlog> Auditlogs { get; set; }

    public virtual DbSet<Emailconfiguration> Emailconfigurations { get; set; }

    public virtual DbSet<Folder> Folders { get; set; }

    public virtual DbSet<Sharelink> Sharelinks { get; set; }

    public virtual DbSet<Storageaccount> Storageaccounts { get; set; }

    public virtual DbSet<Storageplan> Storageplans { get; set; }

    public virtual DbSet<Storageprovider> Storageproviders { get; set; }

    public virtual DbSet<Subscription> Subscriptions { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Userfile> Userfiles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=skyvaultdb;Username=postgres;Password=harry10");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("pgcrypto");

        modelBuilder.Entity<Additionalstoragepurchase>(entity =>
        {
            entity.HasKey(e => e.Additionalstoragepurchaseid).HasName("additionalstoragepurchases_pkey");

            entity.ToTable("additionalstoragepurchases");

            entity.HasIndex(e => e.Userid, "ix_additionalstoragepurchases_userid");

            entity.Property(e => e.Additionalstoragepurchaseid)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("additionalstoragepurchaseid");
            entity.Property(e => e.Price)
                .HasPrecision(10, 2)
                .HasColumnName("price");
            entity.Property(e => e.Purchasedate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("purchasedate");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.Storageamountgb).HasColumnName("storageamountgb");
            entity.Property(e => e.Userid).HasColumnName("userid");

            entity.HasOne(d => d.User).WithMany(p => p.Additionalstoragepurchases)
                .HasForeignKey(d => d.Userid)
                .HasConstraintName("fk_additionalstorage_user");
        });

        modelBuilder.Entity<Auditlog>(entity =>
        {
            entity.HasKey(e => e.Auditlogid).HasName("auditlogs_pkey");

            entity.ToTable("auditlogs");

            entity.HasIndex(e => e.Administratorid, "ix_auditlogs_administratorid");

            entity.HasIndex(e => e.Entityname, "ix_auditlogs_entityname");

            entity.HasIndex(e => e.Performedat, "ix_auditlogs_performedat");

            entity.Property(e => e.Auditlogid)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("auditlogid");
            entity.Property(e => e.Action)
                .HasMaxLength(100)
                .HasColumnName("action");
            entity.Property(e => e.Administratorid).HasColumnName("administratorid");
            entity.Property(e => e.Details).HasColumnName("details");
            entity.Property(e => e.Entityid).HasColumnName("entityid");
            entity.Property(e => e.Entityname)
                .HasMaxLength(100)
                .HasColumnName("entityname");
            entity.Property(e => e.Performedat)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("performedat");

            entity.HasOne(d => d.Administrator).WithMany(p => p.Auditlogs)
                .HasForeignKey(d => d.Administratorid)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_auditlog_admin");
        });

        modelBuilder.Entity<Emailconfiguration>(entity =>
        {
            entity.HasKey(e => e.Emailconfigurationid).HasName("emailconfigurations_pkey");

            entity.ToTable("emailconfigurations");

            entity.HasIndex(e => e.Isactive, "ix_emailconfigurations_isactive");

            entity.HasIndex(e => e.Senderemail, "ix_emailconfigurations_senderemail");

            entity.Property(e => e.Emailconfigurationid)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("emailconfigurationid");
            entity.Property(e => e.Createdat)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("createdat");
            entity.Property(e => e.Encryptedpassword).HasColumnName("encryptedpassword");
            entity.Property(e => e.Isactive)
                .HasDefaultValue(true)
                .HasColumnName("isactive");
            entity.Property(e => e.Requiresauthentication)
                .HasDefaultValue(true)
                .HasColumnName("requiresauthentication");
            entity.Property(e => e.Senderdisplayname).HasColumnName("senderdisplayname");
            entity.Property(e => e.Senderemail)
                .HasMaxLength(255)
                .HasColumnName("senderemail");
            entity.Property(e => e.Smtphost)
                .HasMaxLength(255)
                .HasColumnName("smtphost");
            entity.Property(e => e.Smtpport).HasColumnName("smtpport");
            entity.Property(e => e.Updatedat)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("updatedat");
            entity.Property(e => e.Usessl)
                .HasDefaultValue(true)
                .HasColumnName("usessl");
            entity.Property(e => e.Username)
                .HasMaxLength(255)
                .HasColumnName("username");
        });

        modelBuilder.Entity<Folder>(entity =>
        {
            entity.HasKey(e => e.Folderid).HasName("folders_pkey");

            entity.ToTable("folders");

            entity.HasIndex(e => new { e.Ownerid, e.Parentfolderid, e.Name }, "ix_folder_search");

            entity.HasIndex(e => e.Isdeleted, "ix_folders_isdeleted");

            entity.HasIndex(e => e.Name, "ix_folders_name");

            entity.HasIndex(e => e.Ownerid, "ix_folders_ownerid");

            entity.HasIndex(e => e.Parentfolderid, "ix_folders_parentfolderid");

            entity.Property(e => e.Folderid)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("folderid");
            entity.Property(e => e.Createdat)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("createdat");
            entity.Property(e => e.Deletedat).HasColumnName("deletedat");
            entity.Property(e => e.Isdeleted)
                .HasDefaultValue(false)
                .HasColumnName("isdeleted");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasColumnName("name");
            entity.Property(e => e.Originalparentfolderid).HasColumnName("originalparentfolderid");
            entity.Property(e => e.Ownerid).HasColumnName("ownerid");
            entity.Property(e => e.Parentfolderid).HasColumnName("parentfolderid");
            entity.Property(e => e.Updatedat)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("updatedat");

            entity.HasOne(d => d.Originalparentfolder).WithMany(p => p.InverseOriginalparentfolder)
                .HasForeignKey(d => d.Originalparentfolderid)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_folder_originalparent");

            entity.HasOne(d => d.Owner).WithMany(p => p.Folders)
                .HasForeignKey(d => d.Ownerid)
                .HasConstraintName("fk_folder_user");

            entity.HasOne(d => d.Parentfolder).WithMany(p => p.InverseParentfolder)
                .HasForeignKey(d => d.Parentfolderid)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_folder_parent");
        });

        modelBuilder.Entity<Sharelink>(entity =>
        {
            entity.HasKey(e => e.Sharelinkid).HasName("sharelinks_pkey");

            entity.ToTable("sharelinks");

            entity.HasIndex(e => e.Expiresat, "ix_sharelinks_expiresat");

            entity.HasIndex(e => e.Fileid, "ix_sharelinks_fileid");

            entity.HasIndex(e => e.Ownerid, "ix_sharelinks_ownerid");

            entity.HasIndex(e => e.Sharetoken, "ix_sharelinks_sharetoken").IsUnique();

            entity.HasIndex(e => e.Sharetoken, "sharelinks_sharetoken_key").IsUnique();

            entity.Property(e => e.Sharelinkid)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("sharelinkid");
            entity.Property(e => e.Createdat)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("createdat");
            entity.Property(e => e.Expiresat).HasColumnName("expiresat");
            entity.Property(e => e.Fileid).HasColumnName("fileid");
            entity.Property(e => e.Isrevoked)
                .HasDefaultValue(false)
                .HasColumnName("isrevoked");
            entity.Property(e => e.Ownerid).HasColumnName("ownerid");
            entity.Property(e => e.Sharetoken)
                .HasMaxLength(255)
                .HasColumnName("sharetoken");

            entity.HasOne(d => d.File).WithMany(p => p.Sharelinks)
                .HasForeignKey(d => d.Fileid)
                .HasConstraintName("fk_sharelink_userfile");

            entity.HasOne(d => d.Owner).WithMany(p => p.Sharelinks)
                .HasForeignKey(d => d.Ownerid)
                .HasConstraintName("fk_sharelink_user");
        });

        modelBuilder.Entity<Storageaccount>(entity =>
        {
            entity.HasKey(e => e.Storageaccountid).HasName("storageaccounts_pkey");

            entity.ToTable("storageaccounts");

            entity.HasIndex(e => e.Isactive, "ix_storageaccounts_isactive");

            entity.HasIndex(e => e.Providerid, "ix_storageaccounts_providerid");

            entity.Property(e => e.Storageaccountid)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("storageaccountid");
            entity.Property(e => e.Accountname)
                .HasMaxLength(150)
                .HasColumnName("accountname");
            entity.Property(e => e.Createdat)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("createdat");
            entity.Property(e => e.Isactive)
                .HasDefaultValue(true)
                .HasColumnName("isactive");
            entity.Property(e => e.Priority)
                .HasDefaultValue(1)
                .HasColumnName("priority");
            entity.Property(e => e.Providerid).HasColumnName("providerid");
            entity.Property(e => e.Totalcapacitybytes).HasColumnName("totalcapacitybytes");
            entity.Property(e => e.Usedcapacitybytes)
                .HasDefaultValue(0L)
                .HasColumnName("usedcapacitybytes");

            entity.HasOne(d => d.Provider).WithMany(p => p.Storageaccounts)
                .HasForeignKey(d => d.Providerid)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_storageaccount_provider");
        });

        modelBuilder.Entity<Storageplan>(entity =>
        {
            entity.HasKey(e => e.Storageplanid).HasName("storageplans_pkey");

            entity.ToTable("storageplans");

            entity.HasIndex(e => e.Name, "storageplans_name_key").IsUnique();

            entity.Property(e => e.Storageplanid)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("storageplanid");
            entity.Property(e => e.Billingcycle).HasColumnName("billingcycle");
            entity.Property(e => e.Isactive)
                .HasDefaultValue(true)
                .HasColumnName("isactive");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Price)
                .HasPrecision(10, 2)
                .HasColumnName("price");
            entity.Property(e => e.Storagesizegb).HasColumnName("storagesizegb");
        });

        modelBuilder.Entity<Storageprovider>(entity =>
        {
            entity.HasKey(e => e.Providerid).HasName("storageproviders_pkey");

            entity.ToTable("storageproviders");

            entity.Property(e => e.Providerid)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("providerid");
            entity.Property(e => e.Createdat)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("createdat");
            entity.Property(e => e.Isactive)
                .HasDefaultValue(true)
                .HasColumnName("isactive");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Providertype)
                .HasMaxLength(50)
                .HasColumnName("providertype");
        });

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.HasKey(e => e.Subscriptionid).HasName("subscriptions_pkey");

            entity.ToTable("subscriptions");

            entity.HasIndex(e => new { e.Userid, e.Status }, "ix_subscription_active");

            entity.HasIndex(e => e.Status, "ix_subscriptions_status");

            entity.HasIndex(e => e.Storageplanid, "ix_subscriptions_storageplanid");

            entity.HasIndex(e => e.Userid, "ix_subscriptions_userid");

            entity.Property(e => e.Subscriptionid)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("subscriptionid");
            entity.Property(e => e.Enddate).HasColumnName("enddate");
            entity.Property(e => e.Startdate).HasColumnName("startdate");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.Graceperiodenddate)
                .HasColumnType("timestamp with time zone")
                .HasColumnName("graceperiodenddate");
            entity.Property(e => e.Storageplanid).HasColumnName("storageplanid");
            entity.Property(e => e.Userid).HasColumnName("userid");

            entity.HasOne(d => d.Storageplan).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.Storageplanid)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_subscription_storageplan");

            entity.HasOne(d => d.User).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.Userid)
                .HasConstraintName("fk_subscription_user");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Userid).HasName("users_pkey");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "users_email_key").IsUnique();

            entity.Property(e => e.Userid)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("userid");
            entity.Property(e => e.Allocatedstoragebytes)
                .HasDefaultValue(0L)
                .HasColumnName("allocatedstoragebytes");
            entity.Property(e => e.Createdat)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("createdat");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.Firstname)
                .HasMaxLength(100)
                .HasColumnName("firstname");
            entity.Property(e => e.Isactive)
                .HasDefaultValue(true)
                .HasColumnName("isactive");
            entity.Property(e => e.Isemailverified)
                .HasDefaultValue(false)
                .HasColumnName("isemailverified");
            entity.Property(e => e.Lastname)
                .HasMaxLength(100)
                .HasColumnName("lastname");
            entity.Property(e => e.Passwordhash)
                .HasMaxLength(255)
                .HasColumnName("passwordhash");
            entity.Property(e => e.Role).HasColumnName("role");
            entity.Property(e => e.Updatedat)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("updatedat");
            entity.Property(e => e.Usedstoragebytes)
                .HasDefaultValue(0L)
                .HasColumnName("usedstoragebytes");
        });

        modelBuilder.Entity<Userfile>(entity =>
        {
            entity.HasKey(e => e.Fileid).HasName("userfile_pkey");

            entity.ToTable("userfile");

            entity.HasIndex(e => e.Filename, "ix_userfile_filename");

            entity.HasIndex(e => e.Folderid, "ix_userfile_folderid");

            entity.HasIndex(e => e.Isdeleted, "ix_userfile_isdeleted");

            entity.HasIndex(e => e.Mimetype, "ix_userfile_mimetype");

            entity.HasIndex(e => e.Ownerid, "ix_userfile_ownerid");

            entity.HasIndex(e => e.Providerobjectid, "ix_userfile_providerobjectid").IsUnique();

            entity.HasIndex(e => new { e.Ownerid, e.Folderid, e.Filename }, "ix_userfile_search");

            entity.HasIndex(e => e.Storageaccountid, "ix_userfile_storageaccountid");

            entity.Property(e => e.Fileid)
                .HasDefaultValueSql("gen_random_uuid()")
                .HasColumnName("fileid");
            entity.Property(e => e.Deletedat).HasColumnName("deletedat");
            entity.Property(e => e.Extension)
                .HasMaxLength(20)
                .HasColumnName("extension");
            entity.Property(e => e.Filename)
                .HasMaxLength(255)
                .HasColumnName("filename");
            entity.Property(e => e.Filesizebytes).HasColumnName("filesizebytes");
            entity.Property(e => e.Folderid).HasColumnName("folderid").IsRequired(false);
            entity.Property(e => e.Isdeleted).HasDefaultValue(false).HasColumnName("isdeleted");
            entity.Property(e => e.Mimetype)
                .HasMaxLength(100)
                .HasColumnName("mimetype");
            entity.Property(e => e.Ownerid).HasColumnName("ownerid");
            entity.Property(e => e.Providerobjectid)
                .HasMaxLength(255)
                .HasColumnName("providerobjectid");
            entity.Property(e => e.Storageaccountid).HasColumnName("storageaccountid");
            entity.Property(e => e.Updatedat)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("updatedat");
            entity.Property(e => e.Uploadedat)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("uploadedat");

            entity.HasOne(d => d.Folder).WithMany(p => p.Userfiles)
                .HasForeignKey(d => d.Folderid)
                .HasConstraintName("fk_userfile_folder");

            entity.HasOne(d => d.Owner).WithMany(p => p.Userfiles)
                .HasForeignKey(d => d.Ownerid)
                .HasConstraintName("fk_userfile_user");

            entity.HasOne(d => d.Storageaccount).WithMany(p => p.Userfiles)
                .HasForeignKey(d => d.Storageaccountid)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_userfile_storageaccount");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
