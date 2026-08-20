using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace SkyVault.Exceptions;

public sealed class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        if (httpContext.Response.HasStarted)
        {
            _logger.LogWarning(exception, "An exception occurred after the response started for {Path}.", httpContext.Request.Path);
            return false;
        }

        var (statusCode, message) = MapException(exception, httpContext.RequestAborted);
        var traceId = Activity.Current?.Id ?? httpContext.TraceIdentifier;

        if (statusCode >= StatusCodes.Status500InternalServerError)
        {
            _logger.LogError(exception, "Unhandled exception for {Method} {Path}. RequestId: {RequestId}", httpContext.Request.Method, httpContext.Request.Path, httpContext.TraceIdentifier);
        }
        else
        {
            _logger.LogWarning(exception, "Request failed with status code {StatusCode} for {Method} {Path}. RequestId: {RequestId}", statusCode, httpContext.Request.Method, httpContext.Request.Path, httpContext.TraceIdentifier);
        }

        var response = new ApiErrorResponse
        {
            StatusCode = statusCode,
            ExceptionType = exception.GetType().Name,
            Message = message,
            RequestId = httpContext.TraceIdentifier,
            TraceId = traceId,
            Path = httpContext.Request.Path,
            TimestampUtc = DateTime.UtcNow
        };

        httpContext.Response.Clear();
        httpContext.Response.StatusCode = statusCode;
        httpContext.Response.ContentType = "application/json";
        await httpContext.Response.WriteAsJsonAsync(response, JsonSerializerOptions.Web, cancellationToken);
        return true;
    }

    private static (int StatusCode, string Message) MapException(Exception exception, CancellationToken requestAborted)
    {
        return exception switch
        {
            OperationCanceledException when requestAborted.IsCancellationRequested => (499, "The request was canceled by the client."),
            OperationCanceledException => (StatusCodes.Status408RequestTimeout, "The request timed out."),
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, exception.Message),
            KeyNotFoundException => (StatusCodes.Status404NotFound, exception.Message),
            ArgumentException => (StatusCodes.Status400BadRequest, exception.Message),
            ValidationException => (StatusCodes.Status400BadRequest, exception.Message),
            FormatException => (StatusCodes.Status400BadRequest, exception.Message),
            InvalidOperationException => (StatusCodes.Status400BadRequest, exception.Message),
            DbUpdateConcurrencyException => (StatusCodes.Status409Conflict, "The resource was changed by another operation."),
            DbUpdateException => (StatusCodes.Status409Conflict, "The requested database operation could not be completed."),
            JsonException => (StatusCodes.Status400BadRequest, "The request body contains invalid JSON."),
            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred while processing the request.")
        };
    }
}
