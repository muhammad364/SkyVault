namespace SkyVault.Services.PhysicalProviderService;

public interface IPhysicalStorageProvider
{
    string ProviderType { get; }

    Task<string> UploadAsync(Guid storageAccountId,Stream content,string fileName,string contentType,CancellationToken cancellationToken = default);

    Task<Stream> DownloadAsync(Guid storageAccountId,string providerObjectId,CancellationToken cancellationToken = default);

    Task ReplaceAsync(Guid storageAccountId,string providerObjectId,Stream content,string fileName,string contentType,CancellationToken cancellationToken = default);

    Task DeleteAsync(Guid storageAccountId,string providerObjectId,CancellationToken cancellationToken = default);
}