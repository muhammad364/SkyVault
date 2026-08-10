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
    }
}