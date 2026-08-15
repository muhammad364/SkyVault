using SkyVault.DTOs.Search.Requests;
using SkyVault.DTOs.Search.Responses;

namespace SkyVault.Services.SearchService;

public interface ISearchService
{
    Task<IEnumerable<SearchResultDto>> SearchAsync(
        SearchRequestDto request,
        Guid userId,
        CancellationToken cancellationToken = default);
}
