using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Upload;
using Google.Apis.Download;
using Microsoft.Extensions.Options;
using SkyVault.Repository;
using SkyVault.Services.PhysicalProviderService;

namespace SkyVault.Services.PhysicalProviderService.GoogleDriveService;

public class GoogleDriveStorageProvider : IPhysicalStorageProvider
{
    private const string GoogleDriveProviderType = "GoogleDrive";

    public string ProviderType => GoogleDriveProviderType;

    private readonly IStorageAccountRepository _storageAccountRepository;

    private readonly IStorageProviderRepository _storageProviderRepository;

    private readonly IOptions<GoogleDriveOptions> _options;

    public GoogleDriveStorageProvider(
        IStorageAccountRepository storageAccountRepository,
        IStorageProviderRepository storageProviderRepository,
        IOptions<GoogleDriveOptions> options)
    {
        _storageAccountRepository = storageAccountRepository;
        _storageProviderRepository = storageProviderRepository;
        _options = options;
    }

    public async Task<ProviderFileResult> UploadAsync(Guid storageAccountId,Stream content,string fileName,string contentType,CancellationToken cancellationToken = default)
    {
        var context = await GetDriveContextAsync(storageAccountId,cancellationToken);

        var fileMetadata = new Google.Apis.Drive.v3.Data.File
        {
            Name = fileName,
            Parents = new List<string>
            {
                context.RootFolderId
            }
        };

        var uploadRequest = context.DriveService.Files.Create(fileMetadata,content,contentType);

        uploadRequest.Fields = "id,name,mimeType,size, createdTime, modifiedTime";

        var uploadProgress = await uploadRequest.UploadAsync(cancellationToken);

        if (uploadProgress.Status != UploadStatus.Completed || uploadRequest.ResponseBody?.Id is null)
        {
            throw new InvalidOperationException("The file could not be uploaded to Google Drive.");
        }

        var uploadedFile = uploadRequest.ResponseBody;

        if (!uploadedFile.Size.HasValue)
        {
            throw new InvalidOperationException("Google Drive did not return the uploaded file size.");
        }

        return new ProviderFileResult
        {
            ProviderObjectId = uploadedFile.Id,
            FileName = uploadedFile.Name ?? fileName,
            MimeType = uploadedFile.MimeType ?? contentType,
            FileSizeBytes = uploadedFile.Size.Value,
            CreatedAt = uploadedFile.CreatedTimeDateTimeOffset?.UtcDateTime,
            ModifiedAt = uploadedFile.ModifiedTimeDateTimeOffset?.UtcDateTime
        };
    }

    public async Task<Stream> DownloadAsync(Guid storageAccountId,string providerObjectId,CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(providerObjectId))
        {
            throw new ArgumentException("Provider object ID is required.", nameof(providerObjectId));
        }

        var context = await GetDriveContextAsync(storageAccountId,cancellationToken);

        var downloadStream = new MemoryStream();

        var downloadRequest =context.DriveService.Files.Get(providerObjectId);

        var downloadProgress =await downloadRequest.DownloadAsync(downloadStream, cancellationToken);

        if (downloadProgress.Status != DownloadStatus.Completed)
        {
            downloadStream.Dispose();

            throw new InvalidOperationException("The file could not be downloaded from Google Drive.");
        }

        downloadStream.Position = 0;

        return downloadStream;
    }

    public async Task<ProviderFileResult> ReplaceAsync(Guid storageAccountId,string providerObjectId,Stream content,string fileName,string contentType,CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(providerObjectId))
        {
            throw new ArgumentException("Provider object ID is required.",nameof(providerObjectId));
        }

        var context = await GetDriveContextAsync(storageAccountId,cancellationToken);

        var fileMetadata = new Google.Apis.Drive.v3.Data.File
            {
                Name = fileName
            };

        var updateRequest = context.DriveService.Files.Update(fileMetadata,providerObjectId,content,contentType);

        updateRequest.Fields = "id,name,mimeType,size,createdTime,modifiedTime";

        var uploadProgress = await updateRequest.UploadAsync(cancellationToken);

        if (uploadProgress.Status != UploadStatus.Completed || updateRequest.ResponseBody?.Id is null)
        {
            throw new InvalidOperationException("The file could not be replaced in Google Drive.");
        }

        var replacedFile = updateRequest.ResponseBody;

        if (!replacedFile.Size.HasValue)
        {
            throw new InvalidOperationException("Google Drive did not return the replaced file size.");
        }

        return new ProviderFileResult
        {
            ProviderObjectId = replacedFile.Id,
            FileName = replacedFile.Name ?? fileName,
            MimeType = replacedFile.MimeType ?? contentType,
            FileSizeBytes = replacedFile.Size.Value,
            CreatedAt = replacedFile.CreatedTimeDateTimeOffset?.UtcDateTime,
            ModifiedAt = replacedFile.ModifiedTimeDateTimeOffset?.UtcDateTime
        };
    }

    public async Task<ProviderFileResult> CopyAsync(Guid storageAccountId,string providerObjectId,string fileName,CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(providerObjectId))
        {
            throw new ArgumentException("Provider object ID is required.",nameof(providerObjectId));
        }

        var context = await GetDriveContextAsync(storageAccountId,cancellationToken);

        var metadata =new Google.Apis.Drive.v3.Data.File
            {
                Name = fileName,
                Parents = new List<string>
                {
                    context.RootFolderId
                }
            };

        var copyRequest = context.DriveService.Files.Copy(metadata, providerObjectId);

        copyRequest.Fields = "id,name,mimeType,size,createdTime,modifiedTime";

        var copiedFile = await copyRequest.ExecuteAsync(cancellationToken);

        if (copiedFile?.Id is null)
        {
            throw new InvalidOperationException("The file could not be copied in Google Drive.");
        }

        if (!copiedFile.Size.HasValue)
        {
            throw new InvalidOperationException("Google Drive did not return the copied file size.");
        }

        return new ProviderFileResult
        {
            ProviderObjectId = copiedFile.Id,
            FileName = copiedFile.Name ?? fileName,
            MimeType = copiedFile.MimeType ?? "application/octet-stream",
            FileSizeBytes = copiedFile.Size.Value,
            CreatedAt = copiedFile.CreatedTimeDateTimeOffset?.UtcDateTime,
            ModifiedAt = copiedFile.ModifiedTimeDateTimeOffset?.UtcDateTime
        };
    }

    public async Task DeleteAsync(Guid storageAccountId,string providerObjectId,CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(providerObjectId))
        {
            throw new ArgumentException("Provider object ID is required.",nameof(providerObjectId));
        }

        var context = await GetDriveContextAsync(storageAccountId,cancellationToken);

        await context.DriveService.Files.Delete(providerObjectId).ExecuteAsync(cancellationToken);
    }

    private async Task<GoogleDriveContext> GetDriveContextAsync(Guid storageAccountId,CancellationToken cancellationToken)
    {
        var storageAccount = await _storageAccountRepository.GetByIdAsync(storageAccountId, cancellationToken);

        if (storageAccount is null)
        {
            throw new InvalidOperationException("Storage account was not found.");
        }

        if (!storageAccount.Isactive)
        {
            throw new InvalidOperationException("The selected storage account is inactive.");
        }

        var storageProvider =await _storageProviderRepository.GetByIdAsync(storageAccount.Providerid, cancellationToken);

        if (storageProvider is null)
        {
            throw new InvalidOperationException("The storage provider associated with the storage account was not found.");
        }

        if (!storageProvider.Isactive)
        {
            throw new InvalidOperationException("The storage provider associated with the storage account is inactive.");
        }

        if (!string.Equals(storageProvider.Providertype,GoogleDriveProviderType,StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("The selected storage account does not belong to the Google Drive provider.");
        }

        var accountOptions =_options.Value.Accounts.FirstOrDefault(account => string
            .Equals(account.AccountName, storageAccount.Accountname, StringComparison.OrdinalIgnoreCase));

        if (accountOptions is null)
        {
            throw new InvalidOperationException(
                "No Google Drive credentials were configured for the selected storage account.");
        }

        if (string.IsNullOrWhiteSpace(
                accountOptions.RefreshToken))
        {
            throw new InvalidOperationException(
                "The Google Drive refresh token for the selected storage account is missing.");
        }

        if (string.IsNullOrWhiteSpace(
                _options.Value.ClientId) ||
            string.IsNullOrWhiteSpace(
                _options.Value.ClientSecret))
        {
            throw new InvalidOperationException(
                "Google Drive OAuth client credentials are not configured.");
        }

        var flow =
            new GoogleAuthorizationCodeFlow(
                new GoogleAuthorizationCodeFlow.Initializer
                {
                    ClientSecrets =
                        new ClientSecrets
                        {
                            ClientId =
                                _options.Value.ClientId,

                            ClientSecret =
                                _options.Value.ClientSecret
                        },

                    Scopes = new[]
                    {
                        DriveService.Scope.DriveFile
                    }
                });

        var tokenResponse =
            new TokenResponse
            {
                RefreshToken =
                    accountOptions.RefreshToken
            };

        var credential =
            new UserCredential(
                flow,
                storageAccount.Accountname,
                tokenResponse);

        var driveService =
            new DriveService(
                new BaseClientService.Initializer
                {
                    HttpClientInitializer =
                        credential,

                    ApplicationName =
                        _options.Value.ApplicationName
                });

        return new GoogleDriveContext
        {
            DriveService =
                driveService,

            RootFolderId =
                string.IsNullOrWhiteSpace(
                    accountOptions.RootFolderId)
                    ? "root"
                    : accountOptions.RootFolderId
        };
    }

    private sealed class GoogleDriveContext
    {
        public DriveService DriveService { get; set; } = null!;

        public string RootFolderId { get; set; } = "root";
    }
}