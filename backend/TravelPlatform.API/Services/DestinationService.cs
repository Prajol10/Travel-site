using Microsoft.EntityFrameworkCore;
using TravelPlatform.API.Data;
using TravelPlatform.API.DTOs.Destination;
using TravelPlatform.API.Models;
namespace TravelPlatform.API.Services
{
    public class DestinationService
    {
        private readonly AppDbContext _db;
        public DestinationService(AppDbContext db)
        {
            _db = db;
        }
        public async Task<List<DestinationDto>> GetAllAsync(Guid tenantId)
        {
            return await _db.Destinations
                .Where(d => d.TenantId == tenantId && d.IsActive)
                .OrderBy(d => d.SortOrder)
                .Select(d => MapToDto(d))
                .ToListAsync();
        }
        public async Task<DestinationDto> CreateAsync(Guid tenantId, CreateDestinationDto dto)
        {
            var destination = new Destination
            {
                TenantId = tenantId,
                Name = dto.Name,
                Country = dto.Country,
                Description = dto.Description,
                ImageUrl = dto.ImageUrl,
                SortOrder = dto.SortOrder
            };
            _db.Destinations.Add(destination);
            await _db.SaveChangesAsync();
            return MapToDto(destination);
        }
        public async Task DeleteAsync(Guid tenantId, Guid id)
        {
            var destination = await _db.Destinations
                .FirstOrDefaultAsync(d => d.TenantId == tenantId && d.Id == id)
                ?? throw new KeyNotFoundException("Destination not found");
            _db.Destinations.Remove(destination);
            await _db.SaveChangesAsync();
        }
        private static DestinationDto MapToDto(Destination d) => new()
        {
            Id = d.Id,
            Name = d.Name,
            Country = d.Country,
            Description = d.Description,
            ImageUrl = d.ImageUrl,
            SortOrder = d.SortOrder,
            IsActive = d.IsActive
        };
    }
}
