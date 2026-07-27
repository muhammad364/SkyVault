using SkyVault.Models;
using SkyVault.Data;
using Microsoft.EntityFrameworkCore;

namespace SkyVault.Repository;

public class UserRepository : IUserRepository
{
    private readonly SkyVaultDbContext _dbContext;

    public UserRepository(SkyVaultDbContext skyVaultDbContext)
    {
        _dbContext = skyVaultDbContext;
    }
    public async Task AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _dbContext.Users.AddAsync(user, cancellationToken);
    }

    public async Task<User?> GetByIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Userid == userId, cancellationToken);
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }

    public async Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default){
        return await _dbContext.Users.AnyAsync(u => u.Email ==email, cancellationToken);
    }

    public async Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default){
        return await _dbContext.Users.ToListAsync(cancellationToken);
    }

    public void Update(User user)
    {
        _dbContext.Users.Update(user);
    }
}