# SkyVault Backend Implementation Guide

## Purpose

This document defines the implementation boundaries between the
Repository, Service and Controller layers for SkyVault. It is derived
only from the finalized SRS, finalized PostgreSQL schema, scaffolded EF
Core models, and repository interfaces validated during design.

## Layer Responsibilities

### Repository Layer

Responsible only for persistence. - Query entities. - Insert entities. -
Update entities. - Never contain business logic. - Never generate
JWTs. - Never hash passwords. - Never call Google Drive. - Never perform
payment processing. - Never perform authorization. - Never coordinate
multiple repositories.

### Service Layer

Responsible for business logic. - Authentication & JWT generation. -
Password hashing. - Email verification. - Ownership validation. -
Duplicate file/folder validation. - Folder hierarchy validation. -
Storage quota calculations. - Storage account selection. - Google Drive
upload/download. - Share token generation. - Payment processing. - Audit
log creation. - Status transitions. - Transaction coordination.

### Controller Layer

-   Receive HTTP requests.
-   Validate request models.
-   Call services.
-   Return HTTP responses.

## Global Decisions

-   Soft delete for Folder and UserFile uses IsDeleted/DeletedAt.
-   StorageProvider and StoragePlan use IsActive instead of delete.
-   Audit logs are immutable.
-   Subscriptions and AdditionalStoragePurchase are historical records.
-   JWTs are never stored in the database.

# Repository Specifications

## IUserRepository

Methods: - AddAsync - GetByIdAsync - GetByEmailAsync -
EmailExistsAsync - GetAllAsync - Update

Repository: - Persist and retrieve User data.

Service: - Registration - Login - Password hashing - JWT generation -
Email verification - Activate/deactivate user - Storage allocation
updates

## IStoragePlanRepository

Methods: - GetAllAsync - GetByIdAsync - GetByNameAsync - AddAsync -
Update

Repository: - Persist and retrieve plans.

Service: - Activate/deactivate plans. - Validate subscriptions.

## ISubscriptionRepository

Methods: - AddAsync - GetByIdAsync - GetByUserIdAsync - GetAllAsync -
Update

Repository: - Persist and retrieve subscriptions.

Service: - Purchase workflow. - Renewals. - Expiry handling. - Status
transitions.

## IAdditionalStoragePurchaseRepository

Methods: - AddAsync - GetByIdAsync - GetByUserIdAsync - GetAllAsync -
Update

Repository: - Persist purchase records.

Service: - Payment verification. - Update purchase status. - Increase
allocated storage.

## IStorageProviderRepository

Methods: - AddAsync - GetByIdAsync - GetAllAsync - Update

Repository: - Persist provider information.

Service: - Activate/deactivate providers. - Prevent use of inactive
providers.

## IFolderRepository

Methods: - AddAsync - GetByIdAsync - GetByUserIdAsync - ExistsAsync -
Update

Repository: - Persist folders.

Service: - Duplicate validation. - Ownership validation. - Rename. -
Move. - Soft delete. - Restore. - Hierarchy validation.

## IUserFileRepository

Methods: - AddAsync - GetByIdAsync - GetByUserIdAsync - ExistsAsync -
Update

Repository: - Persist metadata.

Service: - Upload to Google Drive. - Download. - Replace. - Quota
validation. - Soft delete. - Restore.

## IShareLinkRepository

Methods: - AddAsync - GetByIdAsync - GetByTokenAsync -
GetByFileIdAsync - GetByOwnerIdAsync - Update

Repository: - Persist share links.

Service: - Generate secure token. - Validate expiry. - Validate
revocation.

## IStorageAccountRepository

Methods: - AddAsync - GetByIdAsync - GetAllAsync - Update

Repository: - Persist storage accounts.

Service: - Select account for upload. - Update used capacity. -
Activate/deactivate accounts.

## IAuditLogRepository

Methods: - AddAsync - GetByIdAsync - GetAllAsync(administratorId)
Repository: - Persist audit logs.

Service: - Decide what events are logged. - Create audit entries.

# Feature Mapping

  -----------------------------------------------------------------------
  Feature                 Repository              Service
  ----------------------- ----------------------- -----------------------
  Register User           Save User               Hash password, validate
                                                  email

  Login                   GetByEmail              Verify password,
                                                  generate JWT

  Upload File             Save metadata           Upload to Google Drive,
                                                  allocate storage

  Delete File             Update                  Soft delete logic

  Share File              Save ShareLink          Generate token

  Purchase Subscription   Save Subscription       Payment, status

  Purchase Storage        Save Purchase           Payment, update
                                                  allocation

  Admin Storage Accounts  CRUD                    Capacity logic
  -----------------------------------------------------------------------

# Repository Checklist

-   Is it only persistence? -\> Repository
-   Business rule? -\> Service
-   External API? -\> Service
-   Multiple repositories? -\> Service
-   Token generation? -\> Service
-   Payment? -\> Service

# Service Checklist

-   Enforce business rules.
-   Coordinate repositories.
-   Handle transactions.
-   Integrate external systems.
-   Produce DTOs for controllers.

# Conclusion

These boundaries are frozen for the MVP and should be followed
throughout repository, service and controller implementation unless the
SRS or schema changes.
