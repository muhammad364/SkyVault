using AutoMapper;
using SkyVault.DTOs.Authentication.Requests;
using SkyVault.DTOs.Authentication.Responses;
using SkyVault.DTOs.Folder.Responses;
using SkyVault.DTOs.StoragePlan.Requests;
using SkyVault.DTOs.StoragePlan.Responses;
using SkyVault.DTOs.AdditionalStoragePurchase;
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
    }
}