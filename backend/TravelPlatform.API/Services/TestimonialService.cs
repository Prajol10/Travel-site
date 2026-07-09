using Microsoft.EntityFrameworkCore;
using TravelPlatform.API.Data;
using TravelPlatform.API.DTOs.Testimonial;
using TravelPlatform.API.Models;

namespace TravelPlatform.API.Services
{
    public class TestimonialService
    {
        private readonly AppDbContext _db;

        public TestimonialService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<TestimonialDto>> GetAllAsync(Guid tenantId)
        {
            return await _db.Testimonials
                .Where(t => t.TenantId == tenantId && t.IsActive)
                .OrderBy(t => t.SortOrder)
                .Select(t => MapToDto(t))
                .ToListAsync();
        }

        public async Task<TestimonialDto> CreateAsync(Guid tenantId, CreateTestimonialDto dto)
        {
            var testimonial = new Testimonial
            {
                TenantId = tenantId,
                AuthorName = dto.AuthorName,
                AuthorPhotoUrl = dto.AuthorPhotoUrl,
                AuthorLocation = dto.AuthorLocation,
                TourName = dto.TourName,
                ReviewText = dto.ReviewText,
                Rating = dto.Rating,
                ReviewDate = dto.ReviewDate,
                SourcePlatform = dto.SourcePlatform,
                SortOrder = dto.SortOrder
            };

            _db.Testimonials.Add(testimonial);
            await _db.SaveChangesAsync();

            return MapToDto(testimonial);
        }

        public async Task DeleteAsync(Guid tenantId, Guid id)
        {
            var testimonial = await _db.Testimonials
                .FirstOrDefaultAsync(t => t.TenantId == tenantId && t.Id == id)
                ?? throw new KeyNotFoundException("Testimonial not found");

            _db.Testimonials.Remove(testimonial);
            await _db.SaveChangesAsync();
        }

        private static TestimonialDto MapToDto(Testimonial t) => new()
        {
            Id = t.Id,
            AuthorName = t.AuthorName,
            AuthorPhotoUrl = t.AuthorPhotoUrl,
            AuthorLocation = t.AuthorLocation,
            TourName = t.TourName,
            ReviewText = t.ReviewText,
            Rating = t.Rating,
            ReviewDate = t.ReviewDate,
            SourcePlatform = t.SourcePlatform,
            IsActive = t.IsActive,
            SortOrder = t.SortOrder,
            CreatedAt = t.CreatedAt
        };
    }
}
