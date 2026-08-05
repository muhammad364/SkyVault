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

    public async Task<bool> TryReserveStorageAsync(Guid userId, long storageBytes, CancellationToken cancellationToken = default)
    {
        if (storageBytes <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(storageBytes), "Storage reservation must be greater than zero.");
        }

        var now = DateTime.UtcNow;

        var affectedRows = await _dbContext.Users
            .Where(u =>
                u.Userid == userId &&
                u.Isactive &&
                u.Usedstoragebytes + storageBytes <= u.Allocatedstoragebytes)
            .ExecuteUpdateAsync(
                setters => setters
                    .SetProperty(
                        u => u.Usedstoragebytes,
                        u => u.Usedstoragebytes + storageBytes)
                    .SetProperty(
                        u => u.Updatedat,
                        _ => now),
                cancellationToken);

        return affectedRows == 1;
    }

    public async Task<bool> ReleaseStorageAsync(Guid userId, long storageBytes, CancellationToken cancellationToken = default)
    {
        if (storageBytes <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(storageBytes), "Storage release must be greater than zero.");
        }

        var now = DateTime.UtcNow;

        var affectedRows = await _dbContext.Users
            .Where(u =>
                u.Userid == userId &&
                u.Usedstoragebytes >= storageBytes)
            .ExecuteUpdateAsync(
                setters => setters
                    .SetProperty(
                        u => u.Usedstoragebytes,
                        u => u.Usedstoragebytes - storageBytes)
                    .SetProperty(
                        u => u.Updatedat,
                        _ => now),
                cancellationToken);

        return affectedRows == 1;
    }
}