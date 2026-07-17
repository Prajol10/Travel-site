using Microsoft.EntityFrameworkCore;
using TravelPlatform.API.Data;
using TravelPlatform.API.DTOs.Faq;
using TravelPlatform.API.Models;
namespace TravelPlatform.API.Services
{
    public class FaqItemService
    {
        private readonly AppDbContext _db;
        public FaqItemService(AppDbContext db)
        {
            _db = db;
        }
        public async Task<List<FaqItemDto>> GetAllAsync(Guid tenantId)
        {
            return await _db.FaqItems
                .Where(f => f.TenantId == tenantId && f.IsActive)
                .OrderBy(f => f.SortOrder)
                .Select(f => MapToDto(f))
                .ToListAsync();
        }
        public async Task<FaqItemDto> CreateAsync(Guid tenantId, CreateFaqItemDto dto)
        {
            var faq = new FaqItem
            {
                TenantId = tenantId,
                Question = dto.Question,
                Answer = dto.Answer,
                SortOrder = dto.SortOrder
            };
            _db.FaqItems.Add(faq);
            await _db.SaveChangesAsync();
            return MapToDto(faq);
        }
        public async Task DeleteAsync(Guid tenantId, Guid id)
        {
            var faq = await _db.FaqItems
                .FirstOrDefaultAsync(f => f.TenantId == tenantId && f.Id == id)
                ?? throw new KeyNotFoundException("FAQ not found");
            _db.FaqItems.Remove(faq);
            await _db.SaveChangesAsync();
        }
        private static FaqItemDto MapToDto(FaqItem f) => new()
        {
            Id = f.Id,
            Question = f.Question,
            Answer = f.Answer,
            SortOrder = f.SortOrder,
            IsActive = f.IsActive
        };
    }
}
