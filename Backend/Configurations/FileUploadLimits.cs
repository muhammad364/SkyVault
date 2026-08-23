namespace SkyVault.Configurations;

public static class FileUploadLimits
{
    public const long MaxFileSizeBytes = 100L * 1024L * 1024L;

    // Multipart boundaries and form fields add a small amount beyond the file itself.
    public const long MaxMultipartRequestSizeBytes = MaxFileSizeBytes + (1L * 1024L * 1024L);
}
