namespace SkyVault.Exceptions;

public sealed class ApiErrorResponse
{
    public int StatusCode { get; init; }
    public string ExceptionType { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public string RequestId { get; init; } = string.Empty;
    public string TraceId { get; init; } = string.Empty;
    public string Path { get; init; } = string.Empty;
    public DateTime TimestampUtc { get; init; }
    public IDictionary<string, string[]>? Errors { get; init; }
}
