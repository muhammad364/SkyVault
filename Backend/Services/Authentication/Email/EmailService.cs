namespace SkyVault.Services.Authentication.Email;

public class EmailService : IEmailService
{
    public Task SendVerificationEmailAsync(string email, string verificationToken)
    {
        Console.WriteLine("EMAIL VERIFICATION(Stub)");
        Console.WriteLine($"Recipient : {email}");
        Console.WriteLine($"Token     : {verificationToken}");

        return Task.CompletedTask;
    }

    public Task SendPasswordResetEmailAsync(string email, string resetToken)
    {
        Console.WriteLine("PASSWORD RESET (Development Stub)");
        Console.WriteLine($"Recipient : {email}");
        Console.WriteLine($"Token     : {resetToken}");
        return Task.CompletedTask;
    }
}