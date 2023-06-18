using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {
        //So these two methods are not going to touch our database at all.
        //They're purely for using or purely for uploading and deleting images from cloudinary.
        Task<PhotoUploadResult> AddPhoto(IFormFile file);
        Task<string>DeletePhoto(string publicId);
    }
}