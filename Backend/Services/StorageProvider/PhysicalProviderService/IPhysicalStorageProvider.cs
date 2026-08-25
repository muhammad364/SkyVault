namespace SkyVault.Services.PhysicalProviderService;

public interface IPhysicalStorageProvider
{
    string ProviderType { get; }

    Task<ProviderFileResult> UploadAsync(Guid storageAccountId, Stream content, string fileName, string contentType, CancellationToken cancellationToken = default);

    Task<Stream> DownloadAsync(Guid storageAccountId, string providerObjectId, CancellationToken cancellationToken = default);

    Task<ProviderFileResult> ReplaceAsync(Guid storageAccountId, string providerObjectId, Stream content, string fileName, string contentType, CancellationToken cancellationToken = default);

    Task<ProviderFileResult> CopyAsync(Guid storageAccountId, string providerObjectId, string fileName, CancellationToken cancellationToken = default);

    Task DeleteAsync(Guid storageAccountId, string providerObjectId, CancellationToken cancellationToken = default);
}
