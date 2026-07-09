using Microsoft.EntityFrameworkCore;
using TravelPlatform.API.Data;
using TravelPlatform.API.DTOs.Gallery;
using TravelPlatform.API.Models;
using TravelPlatform.API.Models.Enums;

namespace TravelPlatform.API.Services
{
    public class GalleryService
    {
        private readonly AppDbContext _db;

        public GalleryService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<GalleryItemDto>> GetAllAsync(Guid tenantId, string? mediaType = null)
        {
            var query = _db.GalleryItems
                .Where(g => g.TenantId == tenantId && g.IsActive);

            if (!string.IsNullOrEmpty(mediaType) &&
                Enum.TryParse<GalleryMediaType>(mediaType, true, out var type))
                query = query.Where(g => g.MediaType == type);

            return await query
                .OrderBy(g => g.SortOrder)
                .Select(g => MapToDto(g))
                .ToListAsync();
        }

        public async Task<GalleryItemDto> AddAsync(Guid tenantId, UploadGalleryDto dto)
        {
            var item = new GalleryItem
            {
                TenantId = tenantId,
                Url = dto.Url,
                ThumbnailUrl = dto.ThumbnailUrl,
                Caption = dto.Caption,
                MediaType = Enum.TryParse<GalleryMediaType>(dto.MediaType, out var type)
                    ? type : GalleryMediaType.Photo,
                SortOrder = dto.SortOrder
            };

            _db.GalleryItems.Add(item);
            await _db.SaveChangesAsync();

            return MapToDto(item);
        }

        public async Task DeleteAsync(Guid tenantId, Guid id)
        {
            var item = await _db.GalleryItems
                .FirstOrDefaultAsync(g => g.TenantId == tenantId && g.Id == id)
                ?? throw new KeyNotFoundException("Gallery item not found");

            _db.GalleryItems.Remove(item);
            await _db.SaveChangesAsync();
        }

        private static GalleryItemDto MapToDto(GalleryItem g) => new()
        {
            Id = g.Id,
            Url = g.Url,
            ThumbnailUrl = g.ThumbnailUrl,
            Caption = g.Caption,
            MediaType = g.MediaType.ToString(),
            SortOrder = g.SortOrder,
            IsActive = g.IsActive,
            CreatedAt = g.CreatedAt
        };
    }
}
