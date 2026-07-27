using SkyVault.Models;

namespace SkyVault.Repository;

public interface IUserRepository
{
    Task AddAsync(User user, CancellationToken cancellationToken = default);

    Task<User?> GetByIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default);

    Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default);

    void Update(User user);
}