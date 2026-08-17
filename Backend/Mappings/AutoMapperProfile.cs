using AutoMapper;
using SkyVault.DTOs.Authentication.Requests;
using SkyVault.DTOs.Authentication.Responses;
using SkyVault.DTOs.Folder.Responses;
using SkyVault.DTOs.StoragePlan.Requests;
using SkyVault.DTOs.StoragePlan.Responses;
using SkyVault.DTOs.AdditionalStoragePurchase;
using SkyVault.DTOs.Subscription;
using SkyVault.DTOs.StorageAccount;
using SkyVault.DTOs.StorageProvider;
using SkyVault.DTOs.UserFile.Responses;
using SkyVault.DTOs.UserFile.Requests;
using SkyVault.DTOs.Admin;
using SkyVault.DTOs.Admin.EmailConfiguration;
using SkyVault.DTOs.Search.Responses;
using SkyVault.DTOs.ShareLink.Responses;
using SkyVault.Models;

namespace SkyVault.Mappings;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<RegisterUserRequestDto, User>();

        CreateMap<User, UserProfileResponseDto>();

        CreateMap<Folder, FolderResponseDto>();

        CreateMap<Folder, FolderSummaryDto>();

        CreateMap<Userfile, FileSummaryDto>();

        CreateMap<Storageplan, StoragePlanResponseDto>();

        CreateMap<CreateStoragePlanRequestDto, Storageplan>();

        CreateMap<UpdateStoragePlanRequestDto, Storageplan>();

        CreateMap<Additionalstoragepurchase, PurchaseAdditionalStorageResponseDto>();

        CreateMap<PurchaseAdditionalStorageRequestDto, Additionalstoragepurchase>();

        CreateMap<SubscribeRequestDto, Subscription>();

        CreateMap<Subscription, SubscriptionResponseDto>()
            .ForMember(
                dest => dest.SubscriptionId,
                opt => opt.MapFrom(src => src.Subscriptionid))
            .ForMember(
                dest => dest.StoragePlanId,
                opt => opt.MapFrom(src => src.Storageplanid))
            .ForMember(
                dest => dest.StoragePlanName,
                opt => opt.MapFrom(src => src.Storageplan.Name))
            .ForMember(
                dest => dest.StorageSizeGb,
                opt => opt.MapFrom(src => src.Storageplan.Storagesizegb))
            .ForMember(
                dest => dest.Price,
                opt => opt.MapFrom(src => src.Storageplan.Price))
            .ForMember(
                dest => dest.BillingCycle,
                opt => opt.MapFrom(src => src.Storageplan.Billingcycle))
            .ForMember(
                dest => dest.StartDate,
                opt => opt.MapFrom(src => src.Startdate))
            .ForMember(
                dest => dest.EndDate,
                opt => opt.MapFrom(src => src.Enddate))
            .ForMember(
                dest => dest.Status,
                opt => opt.MapFrom(src => src.Status))
            .ForMember(
                dest => dest.GracePeriodEndDate,
                opt => opt.MapFrom(src => src.Graceperiodenddate));
        
        CreateMap<CreateStorageProviderRequestDto, Storageprovider>();

        CreateMap<UpdateStorageProviderRequestDto, Storageprovider>();

        CreateMap<Storageprovider, StorageProviderResponseDto>()
            .ForMember(
                dest => dest.ProviderId,
                opt => opt.MapFrom(
                    src => src.Providerid))
            .ForMember(
                dest => dest.ProviderType,
                opt => opt.MapFrom(
                    src => src.Providertype))
            .ForMember(
                dest => dest.IsActive,
                opt => opt.MapFrom(
                    src => src.Isactive))
            .ForMember(
                dest => dest.CreatedAt,
                opt => opt.MapFrom(
                    src => src.Createdat));

        CreateMap<CreateStorageAccountRequestDto, Storageaccount>();

        CreateMap<UpdateStorageAccountRequestDto, Storageaccount>();

        CreateMap<Storageaccount, StorageAccountResponseDto>()
            .ForMember(
                dest => dest.StorageAccountId,
                opt => opt.MapFrom(
                    src => src.Storageaccountid))
            .ForMember(
                dest => dest.ProviderId,
                opt => opt.MapFrom(
                    src => src.Providerid))
            .ForMember(
                dest => dest.ProviderName,
                opt => opt.MapFrom(
                    src => src.Provider.Name))
            .ForMember(
                dest => dest.ProviderType,
                opt => opt.MapFrom(
                    src => src.Provider.Providertype))
            .ForMember(
                dest => dest.AccountName,
                opt => opt.MapFrom(
                    src => src.Accountname))
            .ForMember(
                dest => dest.TotalCapacityBytes,
                opt => opt.MapFrom(
                    src => src.Totalcapacitybytes))
            .ForMember(
                dest => dest.UsedCapacityBytes,
                opt => opt.MapFrom(
                    src => src.Usedcapacitybytes))
            .ForMember(
                dest => dest.AvailableCapacityBytes,
                opt => opt.MapFrom(
                    src =>
                        Math.Max(
                            0,
                            src.Totalcapacitybytes -
                            src.Usedcapacitybytes)))
            .ForMember(
                dest => dest.Priority,
                opt => opt.MapFrom(
                    src => src.Priority))
            .ForMember(
                dest => dest.IsActive,
                opt => opt.MapFrom(
                    src => src.Isactive))
            .ForMember(
                dest => dest.CreatedAt,
                opt => opt.MapFrom(
                    src => src.Createdat));
    
        CreateMap<Userfile, FileResponseDto>()
            .ForMember(
                dest => dest.FileId,
                opt => opt.MapFrom(src => src.Fileid))
            .ForMember(
                dest => dest.FolderId,
                opt => opt.MapFrom(src => src.Folderid))
            .ForMember(
                dest => dest.FileName,
                opt => opt.MapFrom(src => src.Filename))
            .ForMember(
                dest => dest.Extension,
                opt => opt.MapFrom(src => src.Extension))
            .ForMember(
                dest => dest.MimeType,
                opt => opt.MapFrom(src => src.Mimetype))
            .ForMember(
                dest => dest.FileSizeBytes,
                opt => opt.MapFrom(src => src.Filesizebytes))
            .ForMember(
                dest => dest.UploadedAt,
                opt => opt.MapFrom(src => src.Uploadedat))
            .ForMember(
                dest => dest.UpdatedAt,
                opt => opt.MapFrom(src => src.Updatedat));

        CreateMap<Userfile, SearchResultDto>()
            .ForMember(
                dest => dest.FileId,
                opt => opt.MapFrom(src => src.Fileid))
            .ForMember(
                dest => dest.FileName,
                opt => opt.MapFrom(src => src.Filename))
            .ForMember(
                dest => dest.FileExtension,
                opt => opt.MapFrom(src => src.Extension))
            .ForMember(
                dest => dest.MimeType,
                opt => opt.MapFrom(src => src.Mimetype))
            .ForMember(
                dest => dest.FileSizeBytes,
                opt => opt.MapFrom(src => src.Filesizebytes))
            .ForMember(
                dest => dest.FolderId,
                opt => opt.MapFrom(src => src.Folderid))
            .ForMember(
                dest => dest.FolderName,
                opt => opt.MapFrom(src => src.Folder != null ? src.Folder.Name : null))
            .ForMember(
                dest => dest.UploadedAt,
                opt => opt.MapFrom(src => src.Uploadedat))
            .ForMember(
                dest => dest.LastModifiedAt,
                opt => opt.MapFrom(src => src.Updatedat));

        CreateMap<Sharelink, ShareLinkDto>()
            .ForMember(
                dest => dest.ShareLinkId,
                opt => opt.MapFrom(src => src.Sharelinkid))
            .ForMember(
                dest => dest.FileId,
                opt => opt.MapFrom(src => src.Fileid))
            .ForMember(
                dest => dest.ShareToken,
                opt => opt.MapFrom(src => src.Sharetoken))
            .ForMember(
                dest => dest.ExpiresAt,
                opt => opt.MapFrom(src => src.Expiresat))
            .ForMember(
                dest => dest.IsRevoked,
                opt => opt.MapFrom(src => src.Isrevoked))
            .ForMember(
                dest => dest.CreatedAt,
                opt => opt.MapFrom(src => src.Createdat));

        CreateMap<User, AdminUserDto>()
            .ForMember(dest => dest.UserId,
                opt => opt.MapFrom(src => src.Userid))
            .ForMember(dest => dest.Email,
                opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.FirstName,
                opt => opt.MapFrom(src => src.Firstname))
            .ForMember(dest => dest.LastName,
                opt => opt.MapFrom(src => src.Lastname))
            .ForMember(dest => dest.IsActive,
                opt => opt.MapFrom(src => src.Isactive))
            .ForMember(dest => dest.IsVerified,
                opt => opt.MapFrom(src => src.Isemailverified));

        CreateMap<User, UserStorageAllocationDto>()
            .ForMember(dest => dest.UserId,
                opt => opt.MapFrom(src => src.Userid))
            .ForMember(dest => dest.UserEmail,
                opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.AllocatedBytes,
                opt => opt.MapFrom(src => src.Allocatedstoragebytes))
            .ForMember(dest => dest.UsedBytes,
                opt => opt.MapFrom(src => src.Usedstoragebytes))
            .ForMember(dest => dest.AvailableBytes,
                opt => opt.MapFrom(src => src.Allocatedstoragebytes - src.Usedstoragebytes));

        CreateMap<Emailconfiguration, EmailConfigurationResponseDto>()
            .ForMember(dest => dest.EmailConfigurationId,
                opt => opt.MapFrom(src => src.Emailconfigurationid))
            .ForMember(dest => dest.SmtpHost,
                opt => opt.MapFrom(src => src.Smtphost))
            .ForMember(dest => dest.SmtpPort,
                opt => opt.MapFrom(src => src.Smtpport))
            .ForMember(dest => dest.UseSsl,
                opt => opt.MapFrom(src => src.Usessl))
            .ForMember(dest => dest.RequiresAuthentication,
                opt => opt.MapFrom(src => src.Requiresauthentication))
            .ForMember(dest => dest.SenderEmail,
                opt => opt.MapFrom(src => src.Senderemail))
            .ForMember(dest => dest.SenderDisplayName,
                opt => opt.MapFrom(src => src.Senderdisplayname))
            .ForMember(dest => dest.Username,
                opt => opt.MapFrom(src => src.Username))
            .ForMember(dest => dest.IsActive,
                opt => opt.MapFrom(src => src.Isactive))
            .ForMember(dest => dest.CreatedAt,
                opt => opt.MapFrom(src => src.Createdat))
            .ForMember(dest => dest.UpdatedAt,
                opt => opt.MapFrom(src => src.Updatedat));
    }
}