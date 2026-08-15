using SkyVault.Models;

namespace SkyVault.Repository;

public interface IEmailConfigurationRepository
{
    Task<IEnumerable<Emailconfiguration>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<Emailconfiguration?> GetByIdAsync(Guid emailConfigurationId, CancellationToken cancellationToken = default);

    Task<Emailconfiguration?> GetActiveAsync(CancellationToken cancellationToken = default);

    Task AddAsync(Emailconfiguration emailConfiguration, CancellationToken cancellationToken = default);

    void Update(Emailconfiguration emailConfiguration);

    void Remove(Emailconfiguration emailConfiguration);
}
