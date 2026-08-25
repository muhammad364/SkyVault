using AutoMapper;
using SkyVault.DTOs.Search.Requests;
using SkyVault.DTOs.Search.Responses;
using SkyVault.Models;
using SkyVault.Repository;

namespace SkyVault.Services.SearchService;

public class SearchService : ISearchService
{
    private readonly IUserFileRepository _userFileRepository;
    private readonly IMapper _mapper;

    public SearchService(IUserFileRepository userFileRepository, IMapper mapper)
    {
        _userFileRepository = userFileRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<SearchResultDto>> SearchAsync(SearchRequestDto request, Guid userId, CancellationToken cancellationToken = default)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        if (request.Query != null)
        {
            request.Query = request.Query.Trim();
        }

        if (request.FileType != null)
        {
            request.FileType = request.FileType.Trim();
        }

        if (request.FromDate.HasValue && request.ToDate.HasValue && request.FromDate.Value > request.ToDate.Value)
        {
            throw new ArgumentException("FromDate cannot be later than ToDate.");
        }

        if (request.Query != null && request.Query.Length == 0)
        {
            throw new ArgumentException("Query cannot be empty.");
        }

        if (request.FileType != null && request.FileType.Length == 0)
        {
            throw new ArgumentException("FileType cannot be empty.");
        }

        var files = await _userFileRepository.GetOwnedActiveFilesAsync(userId, cancellationToken);

        var queryTerms = BuildQueryTerms(request.Query);

        var filteredFiles = files.Where(file => MatchesFileType(file, request.FileType)).Where(file => MatchesDateRange(file, request.FromDate, request.ToDate)).Where(file => MatchesQuery(file, queryTerms)).Select(file => new { File = file, Score = CalculateMatchScore(file, queryTerms) }).OrderByDescending(x => x.Score).ThenBy(x => x.File.Filename).Select(x => x.File).ToList();

        return _mapper.Map<IEnumerable<SearchResultDto>>(filteredFiles);
    }

    private static string[] BuildQueryTerms(string? query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return Array.Empty<string>();
        }

        return query.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).Where(term => !string.IsNullOrWhiteSpace(term)).Select(term => term.ToLowerInvariant()).Distinct().ToArray();
    }

    private static bool MatchesFileType(Userfile file, string? fileType)
    {
        if (string.IsNullOrWhiteSpace(fileType))
        {
            return true;
        }

        var normalizedFileType = fileType.Trim();

        if (string.IsNullOrWhiteSpace(normalizedFileType))
        {
            return true;
        }

        var fileTypeText = file.Extension.TrimStart('.').ToLowerInvariant();
        var mimeTypeText = file.Mimetype.ToLowerInvariant();

        return fileTypeText == normalizedFileType.ToLowerInvariant()
            || mimeTypeText.Contains(normalizedFileType, StringComparison.OrdinalIgnoreCase)
            || fileTypeText.Contains(normalizedFileType, StringComparison.OrdinalIgnoreCase);
    }

    private static bool MatchesDateRange(Userfile file, DateTime? fromDate, DateTime? toDate)
    {
        if (!fromDate.HasValue && !toDate.HasValue)
        {
            return true;
        }

        var uploadedAt = file.Uploadedat;

        if (fromDate.HasValue && uploadedAt.Date < fromDate.Value.Date)
        {
            return false;
        }

        if (toDate.HasValue && uploadedAt.Date > toDate.Value.Date)
        {
            return false;
        }

        return true;
    }

    private static bool MatchesQuery(Userfile file, string[] queryTerms)
    {
        if (queryTerms.Length == 0)
        {
            return true;
        }

        var searchableText = string.Join(' ', file.Filename, file.Mimetype, file.Folder != null ? file.Folder.Name : string.Empty, file.Extension);

        return queryTerms.All(term => searchableText.Contains(term, StringComparison.OrdinalIgnoreCase));
    }

    private static int CalculateMatchScore(Userfile file, string[] queryTerms)
    {
        if (queryTerms.Length == 0)
        {
            return 0;
        }

        var score = 0;

        foreach (var term in queryTerms)
        {
            if (file.Filename.Contains(term, StringComparison.OrdinalIgnoreCase))
            {
                score += 20;
            }

            if (file.Folder != null && file.Folder.Name.Contains(term, StringComparison.OrdinalIgnoreCase))
            {
                score += 10;
            }

            if (file.Mimetype.Contains(term, StringComparison.OrdinalIgnoreCase))
            {
                score += 8;
            }

            if (file.Extension.Contains(term, StringComparison.OrdinalIgnoreCase))
            {
                score += 6;
            }
        }

        return score;
    }
}
