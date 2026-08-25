using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SkyVault.DTOs.Authentication.Requests;
using SkyVault.DTOs.Authentication.Responses;
using SkyVault.Services.Authentication;
using SkyVault.DTOs.Common.Responses;

namespace SkyVault.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<RegisterUserResponseDto>> Register(RegisterUserRequestDto requestDto, CancellationToken cancellationToken = default)
    {
        var response = await _authService.RegisterUserAsync(requestDto, cancellationToken);
        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginRequestDto requestDto, CancellationToken cancellationToken = default)
    {
        var response = await _authService.LoginAsync(requestDto, cancellationToken);
        return Ok(response);
    }

    [HttpPost("verify-email")]
    public async Task<ActionResult<MessageResponseDto>> VerifyEmailAs(VerifyEmailRequestDto requestDto, CancellationToken cancellationToken)
    {
        var response = await _authService.VerifyEmailAsync(requestDto, cancellationToken);

        return Ok(response);
    }

    [HttpPost("resend-verification")]
    public async Task<ActionResult<MessageResponseDto>> ResendVerification(ResendVerificationRequestDto requestDto, CancellationToken cancellationToken)
    {
        var response = await _authService.ResendVerificationEmailAsync(requestDto, cancellationToken);

        return Ok(response);
    }

    [HttpPost("forgot-password")]
    public async Task<ActionResult<MessageResponseDto>> ForgotPassword(ForgotPasswordRequestDto requestDto, CancellationToken cancellationToken)
    {
        var response = await _authService.ForgotPasswordAsync(requestDto, cancellationToken);

        return Ok(response);
    }

    [HttpPost("reset-password")]
    public async Task<ActionResult<MessageResponseDto>> ResetPassword(ResetPasswordRequestDto requestDto, CancellationToken cancellationToken)
    {
        var response = await _authService.ResetPasswordAsync(requestDto, cancellationToken);

        return Ok(response);
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<ActionResult<UserProfileResponseDto>> GetProfile (CancellationToken cancellationToken = default)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var response = await _authService.GetUserProfileAsync(userId, cancellationToken);

        return Ok(response);
    }

    [Authorize]
    [HttpPut("profile")]
    public async Task<ActionResult<UserProfileResponseDto>> UpdateProfile(UpdateUserProfileRequestDto requestDto, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var response = await _authService.UpdateUserProfileAsync(userId, requestDto, cancellationToken);

        return Ok(response);
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<ActionResult<MessageResponseDto>> ChangePassword(ChangePasswordRequestDto requestDto, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var response = await _authService.ChangePasswordAsync(userId, requestDto, cancellationToken);

        return Ok(response);
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult<MessageResponseDto>> Logout(CancellationToken cancellationToken)
    {
        var response = await _authService.LogoutAsync(cancellationToken);

        return Ok(response);
    }
}
