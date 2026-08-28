using Microsoft.AspNetCore.Identity;
using SkyVault.Mappings;
using SkyVault.Services.Authentication.Security;
using SkyVault.Repository;
using SkyVault.Configurations;
using SkyVault.Services.Authentication.Email;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SkyVault.Services.Authentication;
using SkyVault.Services.FoldersService;
using SkyVault.Services.UserFileService;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using SkyVault.Data;
using SkyVault.Services.StorageService;
using SkyVault.Services.StorageService.PaymentService;
using SkyVault.Services.SubscriptionService;
using SkyVault.Services.StorageQuotaService;
using SkyVault.Services.StorageAccount;
using SkyVault.Services.StorageProvider;
using SkyVault.Services.PhysicalProviderService.GoogleDriveService;
using SkyVault.Services.PhysicalProviderService;
using SkyVault.Services.Admin;
using SkyVault.Services.BackgroundJobs;
using SkyVault.Services.Identity;
using SkyVault.Services.SearchService;
using SkyVault.Services.ShareLinkService;
using SkyVault.Services.RecycleBinService;
using SkyVault.Services.AuditLogService;
using SkyVault.Exceptions;
using Microsoft.AspNetCore.Mvc;


var builder = WebApplication.CreateBuilder(args);

const string FrontendCorsPolicy = "SkyVaultFrontend";


// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SkyVault API",
        Version = "v1"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT token without the 'Bearer' prefix." 
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                   Type = ReferenceType.SecurityScheme,
                   Id = "Bearer"
                }
            },
            Array.Empty<String>()
        }

    });
});

builder.Services.AddDbContext<SkyVaultDbContext>(options =>options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IStoragePlanRepository, StoragePlanRepository>();
builder.Services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
builder.Services.AddScoped<IAdditionalStoragePurchaseRepository, AdditionalStoragePurchaseRepository>();
builder.Services.AddScoped<IStorageProviderRepository, StorageProviderRepository>();
builder.Services.AddScoped<IStorageAccountRepository, StorageAccountRepository>();
builder.Services.AddScoped<IFolderRepository, FolderRepository>();
builder.Services.AddScoped<IUserFileRepository, UserFileRepository>();
builder.Services.AddScoped<IShareLinkRepository, ShareLinkRepository>();
builder.Services.AddScoped<IEmailConfigurationRepository, EmailConfigurationRepository>();
builder.Services.AddScoped<IRecycleBinRepository, RecycleBinRepository>();
builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();
builder.Services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
builder.Services.AddSingleton<IEmailJobScheduler, EmailJobScheduler>();

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy
            .WithOrigins("http://localhost:5173","http://127.0.0.1:5173","https://hardcover-earflap-stingray.ngrok-free.dev")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var requestId = context.HttpContext.TraceIdentifier;
        var errors = context.ModelState
            .Where(item => item.Value is not null)
            .ToDictionary(
                item => item.Key,
                item => item.Value!.Errors
                    .Select(error => string.IsNullOrWhiteSpace(error.ErrorMessage)
                        ? "The supplied value is invalid."
                        : error.ErrorMessage)
                    .ToArray());

        return new BadRequestObjectResult(new ApiErrorResponse
        {
            StatusCode = StatusCodes.Status400BadRequest,
            ExceptionType = "ValidationException",
            Message = "One or more validation errors occurred.",
            RequestId = requestId,
            TraceId = requestId,
            Path = context.HttpContext.Request.Path,
            TimestampUtc = DateTime.UtcNow,
            Errors = errors
        });
    };
});
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));
builder.Services.AddScoped<IPasswordHashService, PasswordHashService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IFolderService, FolderService>();
builder.Services.AddScoped<IStoragePlanService, StoragePlanService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<ISubscriptionService, SubscriptionService>();
builder.Services.AddScoped<IStorageProviderService, StorageProviderService>();
builder.Services.AddScoped<IStorageAccountService, StorageAccountService>();
builder.Services.AddScoped<IAdditionalStoragePurchaseService, AdditionalStoragePurchaseService>();
builder.Services.AddScoped<IStorageQuotaService, StorageQuotaService>();
builder.Services.AddScoped<IUserFileService, UserFileService>();
builder.Services.AddScoped<ISearchService, SearchService>();
builder.Services.AddScoped<IShareLinkService, ShareLinkService>();
builder.Services.AddScoped<IRecycleBinService, RecycleBinService>();
builder.Services.AddScoped<IAuditLogService, AuditLogService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IEmailConfigurationAdminService, EmailConfigurationAdminService>();
builder.Services.AddScoped<IEmailConfigurationProvider, EmailConfigurationProvider>();
builder.Services.AddDataProtection();
builder.Services.Configure<GoogleDriveOptions>(builder.Configuration.GetSection("GoogleDrive"));
builder.Services.AddScoped<IPhysicalStorageProvider,GoogleDriveStorageProvider>();
builder.Services.AddHttpContextAccessor();
builder.Services.Configure<BackgroundTaskSchedulerOptions>(
    builder.Configuration.GetSection(BackgroundTaskSchedulerOptions.SectionName));
builder.Services.AddHostedService<QueuedBackgroundWorker>();
builder.Services.AddHostedService<SubscriptionExpiryScheduler>();
builder.Services.AddHostedService<RecycleBinCleanupScheduler>();

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],

            ValidateAudience = true,
            ValidAudience = builder.Configuration["JwtSettings:Audience"],

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    builder.Configuration["JwtSettings:SecretKey"]!)),

            ValidateLifetime = true,

            ClockSkew = TimeSpan.Zero
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();

await DatabaseSeeder.SeedAsync(app.Services);

app.UseExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(FrontendCorsPolicy);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
