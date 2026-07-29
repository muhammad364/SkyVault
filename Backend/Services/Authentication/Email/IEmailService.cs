namespace SkyVault.Services.Authentication.Email;

public interface IEmailService
{
    Task SendVerificationEmailAsync(string email, string verificationToken);

    Task SendPasswordResetEmailAsync(string email, string resetToken);
}