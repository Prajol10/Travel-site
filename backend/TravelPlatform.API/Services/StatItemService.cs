using Microsoft.EntityFrameworkCore;
using TravelPlatform.API.Data;
using TravelPlatform.API.DTOs.Stat;
using TravelPlatform.API.Models;
namespace TravelPlatform.API.Services
{
    public class StatItemService
    {
        private readonly AppDbContext _db;
        public StatItemService(AppDbContext db)
        {
            _db = db;
        }
        public async Task<List<StatItemDto>> GetAllAsync(Guid tenantId)
        {
            return await _db.StatItems
                .Where(s => s.TenantId == tenantId && s.IsActive)
                .OrderBy(s => s.SortOrder)
                .Select(s => MapToDto(s))
                .ToListAsync();
        }
        public async Task<StatItemDto> CreateAsync(Guid tenantId, CreateStatItemDto dto)
        {
            var stat = new StatItem
            {
                TenantId = tenantId,
                Value = dto.Value,
                Label = dto.Label,
                IconName = dto.IconName,
                SortOrder = dto.SortOrder
            };
            _db.StatItems.Add(stat);
            await _db.SaveChangesAsync();
            return MapToDto(stat);
        }
        public async Task DeleteAsync(Guid tenantId, Guid id)
        {
            var stat = await _db.StatItems
                .FirstOrDefaultAsync(s => s.TenantId == tenantId && s.Id == id)
                ?? throw new KeyNotFoundException("Stat item not found");
            _db.StatItems.Remove(stat);
            await _db.SaveChangesAsync();
        }
        private static StatItemDto MapToDto(StatItem s) => new()
        {
            Id = s.Id,
            Value = s.Value,
            Label = s.Label,
            IconName = s.IconName,
            SortOrder = s.SortOrder,
            IsActive = s.IsActive
        };
    }
}
