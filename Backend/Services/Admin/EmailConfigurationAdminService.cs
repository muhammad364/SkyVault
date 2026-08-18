using AutoMapper;
using Microsoft.AspNetCore.DataProtection;
using SkyVault.DTOs.Admin.EmailConfiguration;
using SkyVault.Models;
using SkyVault.Repository;
using SkyVault.Services.AuditLogService;

namespace SkyVault.Services.Admin;

public interface IEmailConfigurationAdminService
{
    Task<IEnumerable<EmailConfigurationResponseDto>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<EmailConfigurationResponseDto?> GetByIdAsync(Guid emailConfigurationId, CancellationToken cancellationToken = default);

    Task<EmailConfigurationResponseDto> CreateAsync(CreateEmailConfigurationRequestDto request, CancellationToken cancellationToken = default);

    Task<EmailConfigurationResponseDto> UpdateAsync(Guid emailConfigurationId, UpdateEmailConfigurationRequestDto request, CancellationToken cancellationToken = default);

    Task<EmailConfigurationResponseDto> ActivateAsync(Guid emailConfigurationId, CancellationToken cancellationToken = default);

    Task<EmailConfigurationResponseDto> DeactivateAsync(Guid emailConfigurationId, CancellationToken cancellationToken = default);

    Task DeleteAsync(Guid emailConfigurationId, CancellationToken cancellationToken = default);
}

public class EmailConfigurationAdminService : IEmailConfigurationAdminService
{
    private readonly IEmailConfigurationRepository _repository;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IDataProtector _dataProtector;
    private readonly IAuditLogService _auditLogService;

    public EmailConfigurationAdminService(
        IEmailConfigurationRepository repository,
        IMapper mapper,
        IUnitOfWork unitOfWork,
        IDataProtectionProvider dataProtectionProvider,
        IAuditLogService auditLogService)
    {
        _repository = repository;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _dataProtector = dataProtectionProvider.CreateProtector("SkyVault.EmailConfiguration");
        _auditLogService = auditLogService;
    }

    public async Task<IEnumerable<EmailConfigurationResponseDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var configs = await _repository.GetAllAsync(cancellationToken);
        return _mapper.Map<IEnumerable<EmailConfigurationResponseDto>>(configs);
    }

    public async Task<EmailConfigurationResponseDto?> GetByIdAsync(Guid emailConfigurationId, CancellationToken cancellationToken = default)
    {
        var entity = await _repository.GetByIdAsync(emailConfigurationId, cancellationToken);
        return entity is null ? null : _mapper.Map<EmailConfigurationResponseDto>(entity);
    }

    public async Task<EmailConfigurationResponseDto> CreateAsync(CreateEmailConfigurationRequestDto request, CancellationToken cancellationToken = default)
    {
        ValidateRequest(request);

        var entity = new Emailconfiguration
        {
            Emailconfigurationid = Guid.NewGuid(),
            Smtphost = request.SmtpHost.Trim(),
            Smtpport = request.SmtpPort,
            Usessl = request.UseSsl,
            Requiresauthentication = request.RequiresAuthentication,
            Senderemail = request.SenderEmail.Trim(),
            Senderdisplayname = string.IsNullOrWhiteSpace(request.SenderDisplayName) ? null : request.SenderDisplayName.Trim(),
            Username = string.IsNullOrWhiteSpace(request.Username) ? null : request.Username.Trim(),
            Encryptedpassword = EncryptPassword(request.Password),
            Isactive = request.IsActive,
            Createdat = DateTime.UtcNow,
            Updatedat = DateTime.UtcNow
        };

        if (request.IsActive)
        {
            await ActivateActiveConfigurationAsync(null, cancellationToken);
        }

        await _repository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _auditLogService.RecordAsync("EmailConfigurationCreated", "EmailConfiguration", entity.Emailconfigurationid, "Administrator created an email configuration.", cancellationToken);

        return _mapper.Map<EmailConfigurationResponseDto>(entity);
    }

    public async Task<EmailConfigurationResponseDto> UpdateAsync(Guid emailConfigurationId, UpdateEmailConfigurationRequestDto request, CancellationToken cancellationToken = default)
    {
        var entity = await _repository.GetByIdAsync(emailConfigurationId, cancellationToken)
            ?? throw new KeyNotFoundException("Email configuration was not found.");

        ValidateRequest(request);

        entity.Smtphost = request.SmtpHost.Trim();
        entity.Smtpport = request.SmtpPort;
        entity.Usessl = request.UseSsl;
        entity.Requiresauthentication = request.RequiresAuthentication;
        entity.Senderemail = request.SenderEmail.Trim();
        entity.Senderdisplayname = string.IsNullOrWhiteSpace(request.SenderDisplayName) ? null : request.SenderDisplayName.Trim();
        entity.Username = string.IsNullOrWhiteSpace(request.Username) ? null : request.Username.Trim();

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            entity.Encryptedpassword = EncryptPassword(request.Password);
        }

        entity.Updatedat = DateTime.UtcNow;
        _repository.Update(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _auditLogService.RecordAsync("EmailConfigurationUpdated", "EmailConfiguration", entity.Emailconfigurationid, "Administrator updated an email configuration.", cancellationToken);

        return _mapper.Map<EmailConfigurationResponseDto>(entity);
    }

    public async Task<EmailConfigurationResponseDto> ActivateAsync(Guid emailConfigurationId, CancellationToken cancellationToken = default)
    {
        var entity = await _repository.GetByIdAsync(emailConfigurationId, cancellationToken)
            ?? throw new KeyNotFoundException("Email configuration was not found.");

        await ActivateActiveConfigurationAsync(entity, cancellationToken);

        entity.Isactive = true;
        entity.Updatedat = DateTime.UtcNow;

        _repository.Update(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _auditLogService.RecordAsync("EmailConfigurationActivated", "EmailConfiguration", entity.Emailconfigurationid, "Administrator activated an email configuration.", cancellationToken);

        return _mapper.Map<EmailConfigurationResponseDto>(entity);
    }

    public async Task<EmailConfigurationResponseDto> DeactivateAsync(Guid emailConfigurationId, CancellationToken cancellationToken = default)
    {
        var entity = await _repository.GetByIdAsync(emailConfigurationId, cancellationToken)
            ?? throw new KeyNotFoundException("Email configuration was not found.");

        entity.Isactive = false;
        entity.Updatedat = DateTime.UtcNow;

        _repository.Update(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _auditLogService.RecordAsync("EmailConfigurationDeactivated", "EmailConfiguration", entity.Emailconfigurationid, "Administrator deactivated an email configuration.", cancellationToken);

        return _mapper.Map<EmailConfigurationResponseDto>(entity);
    }

    public async Task DeleteAsync(Guid emailConfigurationId, CancellationToken cancellationToken = default)
    {
        var entity = await _repository.GetByIdAsync(emailConfigurationId, cancellationToken)
            ?? throw new KeyNotFoundException("Email configuration was not found.");

        _repository.Remove(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        await _auditLogService.RecordAsync("EmailConfigurationDeleted", "EmailConfiguration", entity.Emailconfigurationid, "Administrator deleted an email configuration.", cancellationToken);
    }

    private async Task ActivateActiveConfigurationAsync(Emailconfiguration? entityToActivate, CancellationToken cancellationToken)
    {
        var activeConfig = await _repository.GetActiveAsync(cancellationToken);

        if (activeConfig is null || (entityToActivate is not null && activeConfig.Emailconfigurationid == entityToActivate.Emailconfigurationid))
        {
            return;
        }

        activeConfig.Isactive = false;
        activeConfig.Updatedat = DateTime.UtcNow;
        _repository.Update(activeConfig);
    }

    private static void ValidateRequest(object request)
    {
        var type = request.GetType();

        if (type == typeof(CreateEmailConfigurationRequestDto) || type == typeof(UpdateEmailConfigurationRequestDto))
        {
            var smtpHost = type.GetProperty("SmtpHost")?.GetValue(request) as string;
            var senderEmail = type.GetProperty("SenderEmail")?.GetValue(request) as string;
            var smtpPort = type.GetProperty("SmtpPort")?.GetValue(request) as int?;
            var requiresAuth = type.GetProperty("RequiresAuthentication")?.GetValue(request) as bool?;
            var userName = type.GetProperty("Username")?.GetValue(request) as string;
            var password = type.GetProperty("Password")?.GetValue(request) as string;

            if (string.IsNullOrWhiteSpace(smtpHost))
            {
                throw new InvalidOperationException("SMTP host is required.");
            }

            if (string.IsNullOrWhiteSpace(senderEmail))
            {
                throw new InvalidOperationException("Sender email is required.");
            }

            if (smtpPort is null || smtpPort <= 0 || smtpPort > 65535)
            {
                throw new InvalidOperationException("SMTP port must be between 1 and 65535.");
            }

            if (requiresAuth == true)
            {
                if (string.IsNullOrWhiteSpace(userName))
                {
                    throw new InvalidOperationException("SMTP username is required when authentication is enabled.");
                }

                if (string.IsNullOrWhiteSpace(password))
                {
                    throw new InvalidOperationException("SMTP password is required when authentication is enabled.");
                }
            }
        }
    }

    private string EncryptPassword(string? password)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            return string.Empty;
        }

        return _dataProtector.Protect(password);
    }
}
