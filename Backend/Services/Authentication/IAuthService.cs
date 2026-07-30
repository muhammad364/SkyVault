using SkyVault.DTOs.Authentication.Requests;
using SkyVault.DTOs.Authentication.Responses;
using SkyVault.DTOs.Common.Responses;

namespace SkyVault.Services.Authentication;

public interface IAuthService
{
    Task<RegisterUserResponseDto> RegisterUserAsync(RegisterUserRequestDto userRequestDto, CancellationToken cancellationToken = default);

    Task<LoginResponseDto> LoginAsync(LoginRequestDto loginRequestDto, CancellationToken cancellationToken = default);

    Task<MessageResponseDto> VerifyEmailAsync (VerifyEmailRequestDto verifyEmailRequestDto, CancellationToken cancellationToken = default);

    Task<MessageResponseDto> ForgotPasswordAsync (ForgotPasswordRequestDto forgotPasswordRequestDto, CancellationToken cancellationToken = default);

    Task<MessageResponseDto> ResetPasswordAsync (ResetPasswordRequestDto resetPasswordRequestDto, CancellationToken cancellationToken= default);

    Task<UserProfileResponseDto> GetUserProfileAsync (Guid userId, CancellationToken cancellationToken= default);

    Task<UserProfileResponseDto> UpdateUserProfileAsync (Guid userId, UpdateUserProfileRequestDto updateUserProfileRequestDto, CancellationToken cancellationToken = default);
    Task<MessageResponseDto> LogoutAsync (CancellationToken cancellationToken = default); 
}