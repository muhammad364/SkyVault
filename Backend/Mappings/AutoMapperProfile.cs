using AutoMapper;
using SkyVault.DTOs.Authentication.Requests;
using SkyVault.DTOs.Authentication.Responses;
using SkyVault.DTOs.Folder.Responses;
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
    }
}