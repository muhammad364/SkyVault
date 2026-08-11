CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE Users
(
    UserId UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,

    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,

    IsEmailVerified BOOLEAN NOT NULL DEFAULT FALSE,

    Role SMALLINT NOT NULL
        CHECK (Role IN (0,1)),      -- 0=User,1=Admin

    IsActive BOOLEAN NOT NULL DEFAULT TRUE,

    AllocatedStorageBytes BIGINT NOT NULL DEFAULT 0
        CHECK (AllocatedStorageBytes >= 0),

    UsedStorageBytes BIGINT NOT NULL DEFAULT 0
        CHECK (UsedStorageBytes >= 0),
    
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE StorageProviders
(
    ProviderId UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    Name VARCHAR(100) NOT NULL,

    ProviderType VARCHAR(50) NOT NULL,

    IsActive BOOLEAN NOT NULL DEFAULT TRUE,

    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE StorageAccounts
(
    StorageAccountId UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    ProviderId UUID NOT NULL,

    AccountName VARCHAR(150) NOT NULL,

    TotalCapacityBytes BIGINT NOT NULL
        CHECK (TotalCapacityBytes > 0),

    UsedCapacityBytes BIGINT NOT NULL DEFAULT 0
        CHECK (UsedCapacityBytes >= 0),

    Priority INTEGER NOT NULL DEFAULT 1,

    IsActive BOOLEAN NOT NULL DEFAULT TRUE,

    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_StorageAccount_Provider
        FOREIGN KEY (ProviderId)
        REFERENCES StorageProviders(ProviderId)
        ON DELETE RESTRICT
);

CREATE TABLE StoragePlans
(
    StoragePlanId UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    Name VARCHAR(100) NOT NULL UNIQUE,

    StorageSizeGB INTEGER NOT NULL
        CHECK (StorageSizeGB > 0),

    Price DECIMAL(10,2) NOT NULL
        CHECK (Price >= 0),

    BillingCycle SMALLINT NOT NULL
        CHECK (BillingCycle IN (1,12)),

    IsActive BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE Subscriptions
(
    SubscriptionId UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    UserId UUID NOT NULL,

    StoragePlanId UUID NOT NULL,

    StartDate TIMESTAMPTZ NOT NULL,

    EndDate TIMESTAMPTZ NOT NULL,

    Status SMALLINT NOT NULL
        CHECK (Status IN (0,1,2)),
        -- 0=Active
        -- 1=Expired
        -- 2=Cancelled

    CONSTRAINT FK_Subscription_User
        FOREIGN KEY (UserId)
        REFERENCES Users(UserId)
        ON DELETE CASCADE,

    CONSTRAINT FK_Subscription_StoragePlan
        FOREIGN KEY (StoragePlanId)
        REFERENCES StoragePlans(StoragePlanId)
        ON DELETE RESTRICT,

    CONSTRAINT CK_Subscription_Dates
        CHECK (EndDate > StartDate)
);

CREATE TABLE AdditionalStoragePurchases
(
    AdditionalStoragePurchaseId UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    UserId UUID NOT NULL,

    StorageAmountGB INTEGER NOT NULL
        CHECK (StorageAmountGB > 0),

    Price DECIMAL(10,2) NOT NULL
        CHECK (Price >= 0),

    PurchaseDate TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    Status SMALLINT NOT NULL
        CHECK (Status IN (0,1)),
        -- 0=Active
        -- 1=Inactive

    CONSTRAINT FK_AdditionalStorage_User
        FOREIGN KEY (UserId)
        REFERENCES Users(UserId)
        ON DELETE CASCADE
);


CREATE TABLE Folders
(
    FolderId UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    OwnerId UUID NOT NULL,

    ParentFolderId UUID NULL,

    Name VARCHAR(255) NOT NULL,

    IsDeleted BOOLEAN NOT NULL DEFAULT FALSE,

    DeletedAt TIMESTAMPTZ NULL,

    OriginalParentFolderId UUID NULL,

    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UpdatedAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_Folder_User
        FOREIGN KEY (OwnerId)
        REFERENCES Users(UserId)
        ON DELETE CASCADE,

    CONSTRAINT FK_Folder_Parent
        FOREIGN KEY (ParentFolderId)
        REFERENCES Folders(FolderId)
        ON DELETE CASCADE,

    CONSTRAINT FK_Folder_OriginalParent
        FOREIGN KEY (OriginalParentFolderId)
        REFERENCES Folders(FolderId)
        ON DELETE SET NULL
);

CREATE TABLE UserFile
(
    FileId UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    OwnerId UUID NOT NULL,

    FolderId UUID,

    StorageAccountId UUID NOT NULL,

    FileName VARCHAR(255) NOT NULL,

    Extension VARCHAR(20) NOT NULL,

    MimeType VARCHAR(100) NOT NULL,

    FileSizeBytes BIGINT NOT NULL
        CHECK (FileSizeBytes > 0),

    ProviderObjectId VARCHAR(255) NOT NULL,

    IsDeleted BOOLEAN NOT NULL DEFAULT FALSE,

    DeletedAt TIMESTAMPTZ NULL,

    UploadedAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UpdatedAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_UserFile_User
        FOREIGN KEY (OwnerId)
        REFERENCES Users(UserId)
        ON DELETE CASCADE,

    CONSTRAINT FK_UserFile_Folder
        FOREIGN KEY (FolderId)
        REFERENCES Folders(FolderId)
        ON DELETE CASCADE,

    CONSTRAINT FK_UserFile_StorageAccount
        FOREIGN KEY (StorageAccountId)
        REFERENCES StorageAccounts(StorageAccountId)
        ON DELETE RESTRICT
);

CREATE TABLE ShareLinks
(
    ShareLinkId UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    FileId UUID NOT NULL,

    OwnerId UUID NOT NULL,

    ShareToken VARCHAR(255) NOT NULL UNIQUE,

    ExpiresAt TIMESTAMPTZ NULL,

    IsRevoked BOOLEAN NOT NULL DEFAULT FALSE,

    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_ShareLink_UserFile
        FOREIGN KEY (FileId)
        REFERENCES UserFile(FileId)
        ON DELETE CASCADE,

    CONSTRAINT FK_ShareLink_User
        FOREIGN KEY (OwnerId)
        REFERENCES Users(UserId)
        ON DELETE CASCADE
);


CREATE TABLE AuditLogs
(
    AuditLogId UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    AdministratorId UUID NOT NULL,

    Action VARCHAR(100) NOT NULL,

    EntityName VARCHAR(100) NOT NULL,

    EntityId UUID NOT NULL,

    Details TEXT NULL,

    PerformedAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_AuditLog_Admin
        FOREIGN KEY (AdministratorId)
        REFERENCES Users(UserId)
        ON DELETE RESTRICT
);


-- Storage Accounts
CREATE INDEX IX_StorageAccounts_ProviderId
ON StorageAccounts(ProviderId);

CREATE INDEX IX_StorageAccounts_IsActive
ON StorageAccounts(IsActive);

-- Subscriptions
CREATE INDEX IX_Subscriptions_UserId
ON Subscriptions(UserId);

CREATE INDEX IX_Subscriptions_StoragePlanId
ON Subscriptions(StoragePlanId);

CREATE INDEX IX_Subscriptions_Status
ON Subscriptions(Status);

-- Additional Storage Purchases
CREATE INDEX IX_AdditionalStoragePurchases_UserId
ON AdditionalStoragePurchases(UserId);

-- Folders
CREATE INDEX IX_Folders_OwnerId
ON Folders(OwnerId);

CREATE INDEX IX_Folders_ParentFolderId
ON Folders(ParentFolderId);

CREATE INDEX IX_Folders_IsDeleted
ON Folders(IsDeleted);

CREATE INDEX IX_Folders_Name
ON Folders(Name);

-- Files
CREATE INDEX IX_UserFile_OwnerId
ON UserFile(OwnerId);

CREATE INDEX IX_UserFile_FolderId
ON UserFile(FolderId);

CREATE INDEX IX_UserFile_StorageAccountId
ON UserFile(StorageAccountId);

CREATE UNIQUE INDEX IX_UserFile_ProviderObjectId
ON UserFile(ProviderObjectId);

CREATE INDEX IX_UserFile_IsDeleted
ON UserFile(IsDeleted);

CREATE INDEX IX_UserFile_FileName
ON UserFile(FileName);

CREATE INDEX IX_UserFile_MimeType
ON UserFile(MimeType);

-- Share Links
CREATE UNIQUE INDEX IX_ShareLinks_ShareToken
ON ShareLinks(ShareToken);

CREATE INDEX IX_ShareLinks_FileId
ON ShareLinks(FileId);

CREATE INDEX IX_ShareLinks_OwnerId
ON ShareLinks(OwnerId);

CREATE INDEX IX_ShareLinks_ExpiresAt
ON ShareLinks(ExpiresAt);

-- Audit Logs
CREATE INDEX IX_AuditLogs_AdministratorId
ON AuditLogs(AdministratorId);

CREATE INDEX IX_AuditLogs_PerformedAt
ON AuditLogs(PerformedAt);

CREATE INDEX IX_AuditLogs_EntityName
ON AuditLogs(EntityName);

ALTER TABLE Users
ADD CONSTRAINT CK_User_Storage
CHECK (UsedStorageBytes <= AllocatedStorageBytes);

ALTER TABLE StorageAccounts
ADD CONSTRAINT CK_StorageAccount_Capacity
CHECK (UsedCapacityBytes <= TotalCapacityBytes);

ALTER TABLE Folders
ADD CONSTRAINT CK_Folder_DeleteDate
CHECK (
    (IsDeleted = FALSE AND DeletedAt IS NULL)
    OR
    (IsDeleted = TRUE)
);

ALTER TABLE UserFile
ADD CONSTRAINT CK_UserFile_DeleteDate
CHECK (
    (IsDeleted = FALSE AND DeletedAt IS NULL)
    OR
    (IsDeleted = TRUE)
);

CREATE INDEX IX_UserFile_Search
ON UserFile (OwnerId, FolderId, FileName);

CREATE INDEX IX_Folder_Search
ON Folders (OwnerId, ParentFolderId, Name);

CREATE INDEX IX_Subscription_Active
ON Subscriptions (UserId, Status);
