using AutoMapper;
using SkyVault.DTOs.Authentication.Requests;
using SkyVault.DTOs.Authentication.Responses;
using SkyVault.DTOs.Folder.Responses;
using SkyVault.DTOs.StoragePlan.Requests;
using SkyVault.DTOs.StoragePlan.Responses;
using SkyVault.DTOs.AdditionalStoragePurchase;
using SkyVault.DTOs.Subscription;
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
    }
}