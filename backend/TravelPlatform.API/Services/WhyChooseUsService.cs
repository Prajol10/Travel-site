using Microsoft.EntityFrameworkCore;
using TravelPlatform.API.Data;
using TravelPlatform.API.DTOs.WhyChooseUs;
using TravelPlatform.API.Models;
namespace TravelPlatform.API.Services
{
    public class WhyChooseUsService
    {
        private readonly AppDbContext _db;
        public WhyChooseUsService(AppDbContext db)
        {
            _db = db;
        }
        public async Task<List<WhyChooseUsItemDto>> GetAllAsync(Guid tenantId)
        {
            return await _db.WhyChooseUsItems
                .Where(w => w.TenantId == tenantId && w.IsActive)
                .OrderBy(w => w.SortOrder)
                .Select(w => MapToDto(w))
                .ToListAsync();
        }
        public async Task<WhyChooseUsItemDto> CreateAsync(Guid tenantId, CreateWhyChooseUsItemDto dto)
        {
            var item = new WhyChooseUsItem
            {
                TenantId = tenantId,
                Title = dto.Title,
                Description = dto.Description,
                IconName = dto.IconName,
                SortOrder = dto.SortOrder
            };
            _db.WhyChooseUsItems.Add(item);
            await _db.SaveChangesAsync();
            return MapToDto(item);
        }
        public async Task DeleteAsync(Guid tenantId, Guid id)
        {
            var item = await _db.WhyChooseUsItems
                .FirstOrDefaultAsync(w => w.TenantId == tenantId && w.Id == id)
                ?? throw new KeyNotFoundException("Why Choose Us item not found");
            _db.WhyChooseUsItems.Remove(item);
            await _db.SaveChangesAsync();
        }
        private static WhyChooseUsItemDto MapToDto(WhyChooseUsItem w) => new()
        {
            Id = w.Id,
            Title = w.Title,
            Description = w.Description,
            IconName = w.IconName,
            SortOrder = w.SortOrder,
            IsActive = w.IsActive
        };
    }
}
