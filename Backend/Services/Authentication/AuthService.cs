using AutoMapper;
using System.Security.Claims;
using SkyVault.DTOs.Authentication.Requests;
using SkyVault.DTOs.Authentication.Responses;
using SkyVault.Repository;
using SkyVault.Services.Authentication.Email;
using SkyVault.Services.Authentication.Security;
using SkyVault.Models;
using SkyVault.DTOs.Common.Responses;
using SkyVault.Services.BackgroundJobs;
using System.ComponentModel.DataAnnotations;

namespace SkyVault.Services.Authentication;

public class AuthService : IAuthService
{
    private const string RecoveryMessage = "If an account can receive this email, a message is on its way.";

    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly IPasswordHashService _passwordHashService;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IEmailJobScheduler _emailJobScheduler;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUserRepository userRepo, IMapper mapper, IPasswordHashService passhashServ, IJwtTokenService token, IEmailJobScheduler emailJobScheduler, IUnitOfWork unitOfWork, ILogger<AuthService> logger
    )
    {
        _userRepository = userRepo;
        _emailJobScheduler = emailJobScheduler;
        _mapper = mapper;
        _passwordHashService = passhashServ;
        _jwtTokenService = token;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<RegisterUserResponseDto> RegisterUserAsync (RegisterUserRequestDto userRequestDto, CancellationToken cancellationToken = default)
    {
        if (await _userRepository.EmailExistsAsync(userRequestDto.Email, cancellationToken))
        {
            throw new InvalidOperationException ("This email already exists.");
        }

        var user = _mapper.Map<User> (userRequestDto);

        user.Passwordhash = _passwordHashService.HashPassword(userRequestDto.Password);
        user.Isemailverified = false;
        user.Role = 0;
        user.Isactive = true;
        user.Allocatedstoragebytes = 0;
        user.Usedstoragebytes = 0;
        user.Createdat = DateTime.UtcNow;
        user.Updatedat = DateTime.UtcNow;

        await _userRepository.AddAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var verificationToken = _jwtTokenService.GenerateEmailVerificationToken(user);
        await _emailJobScheduler.QueueVerificationEmailAsync(user.Email, verificationToken, cancellationToken);
        return new RegisterUserResponseDto
        {
            UserId = user.Userid,
            Message = "Registration successful. Please verify your email."
        };
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

        if (user == null)
        {
            _logger.LogWarning("Authentication failed for an unknown email address.");
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        var isPasswordValid = _passwordHashService.VerifyPassword(user.Passwordhash, request.Password);

        if (!isPasswordValid)
        {
            _logger.LogWarning("Authentication failed for user {UserId}: invalid credentials.", user.Userid);
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        if (!user.Isactive)
        {
            _logger.LogWarning("Authentication failed for user {UserId}: account is inactive.", user.Userid);
            throw new UnauthorizedAccessException("User account is inactive.");
        }

        if (!user.Isemailverified)
        {
            _logger.LogWarning("Authentication failed for user {UserId}: email is not verified.", user.Userid);
            throw new UnauthorizedAccessException("Please verify your email before logging in.");
        }

        var accessToken = _jwtTokenService.GenerateAccessToken(user);
        _logger.LogInformation("Authentication succeeded for user {UserId}.", user.Userid);

        return new LoginResponseDto{
        Token = accessToken,
        ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtTokenService.GetAccessTokenExpiryInMinutes())
        };
    }    
    public async Task<MessageResponseDto> VerifyEmailAsync(VerifyEmailRequestDto request, CancellationToken cancellationToken = default)
    {
        var principal = _jwtTokenService.ValidateToken(request.Token, "EmailVerification");

        if (principal == null)
        {
            throw new UnauthorizedAccessException("Invalid or expired verification token.");
        }

        var userId = Guid.Parse(principal.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);

        if (user == null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        user.Isemailverified = true;
        user.Updatedat = DateTime.UtcNow;

        _userRepository.Update(user);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new MessageResponseDto
        {
            Message = "Email verified successfully."
        };
    }

    public async Task<MessageResponseDto> ResendVerificationEmailAsync(ResendVerificationRequestDto request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

        if (user is not null && !user.Isemailverified && user.Isactive)
        {
            var verificationToken = _jwtTokenService.GenerateEmailVerificationToken(user);
            await _emailJobScheduler.QueueVerificationEmailAsync(user.Email, verificationToken, cancellationToken);
        }

        return new MessageResponseDto
        {
            Message = RecoveryMessage
        };
    }

    public async Task<MessageResponseDto> ForgotPasswordAsync(ForgotPasswordRequestDto request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

        if (user is not null && user.Isactive)
        {
            var resetToken = _jwtTokenService.GeneratePasswordResetToken(user);
            await _emailJobScheduler.QueuePasswordResetEmailAsync(user.Email, resetToken, cancellationToken);
        }

        return new MessageResponseDto
        {
            Message = RecoveryMessage
        };
    }
    
    public async Task<MessageResponseDto> ResetPasswordAsync (ResetPasswordRequestDto resetPasswordRequestDto, CancellationToken cancellationToken= default)
    {
        var principal = _jwtTokenService.ValidateToken(resetPasswordRequestDto.Token, "PasswordReset");

        if (principal == null)
        {
            throw new UnauthorizedAccessException("Invalid or expired reset token.");
        }
        var userId = Guid.Parse(principal.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);

        if (user == null)
        {
            throw new KeyNotFoundException("User not found.");
        }
        user.Passwordhash = _passwordHashService.HashPassword(resetPasswordRequestDto.NewPassword);
        user.Updatedat = DateTime.UtcNow;

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new MessageResponseDto{
            Message = "Password is updated successfully."
        };
    }
    
    public async Task<UserProfileResponseDto> GetUserProfileAsync (Guid userId, CancellationToken cancellationToken= default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);

        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        return _mapper.Map<UserProfileResponseDto>(user);

    }
    public async Task<UserProfileResponseDto> UpdateUserProfileAsync (Guid userId, UpdateUserProfileRequestDto updateUserProfileRequestDto, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);

        if (user == null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        user.Firstname = updateUserProfileRequestDto.FirstName;
        user.Lastname = updateUserProfileRequestDto.LastName;

        user.Updatedat = DateTime.UtcNow;

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<UserProfileResponseDto>(user);
    }

    public async Task<MessageResponseDto> ChangePasswordAsync(Guid userId, ChangePasswordRequestDto request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);

        if (user == null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        if (!_passwordHashService.VerifyPassword(user.Passwordhash, request.CurrentPassword))
        {
            throw new ValidationException("The current password is incorrect.");
        }

        user.Passwordhash = _passwordHashService.HashPassword(request.NewPassword);
        user.Updatedat = DateTime.UtcNow;

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new MessageResponseDto
        {
            Message = "Password changed successfully."
        };
    }

    public Task<MessageResponseDto> LogoutAsync (CancellationToken cancellationToken = default)
    {
        return Task.FromResult(new MessageResponseDto
        {
            Message = "Logged out successfully"
        });
    }
}
