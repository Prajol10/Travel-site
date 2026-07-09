using Microsoft.EntityFrameworkCore;
using TravelPlatform.API.Data;
using TravelPlatform.API.DTOs.Content;
using TravelPlatform.API.Models;
using TravelPlatform.API.Models.Enums;

namespace TravelPlatform.API.Services
{
    public class ContentService
    {
        private readonly AppDbContext _db;

        public ContentService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<ContentSectionDto>> GetAllAsync(Guid tenantId)
        {
            return await _db.ContentSections
                .Where(c => c.TenantId == tenantId)
                .Select(c => MapToDto(c))
                .ToListAsync();
        }

        public async Task<ContentSectionDto> GetBySectionTypeAsync(Guid tenantId, string sectionType)
        {
            if (!Enum.TryParse<ContentSectionType>(sectionType, true, out var type))
                throw new ArgumentException("Invalid section type");

            var section = await _db.ContentSections
                .FirstOrDefaultAsync(c => c.TenantId == tenantId && c.SectionType == type)
                ?? throw new KeyNotFoundException("Content section not found");

            return MapToDto(section);
        }

        public async Task<ContentSectionDto> UpsertAsync(Guid tenantId, string sectionType, UpdateContentDto dto)
        {
            if (!Enum.TryParse<ContentSectionType>(sectionType, true, out var type))
                throw new ArgumentException("Invalid section type");

            var section = await _db.ContentSections
                .FirstOrDefaultAsync(c => c.TenantId == tenantId && c.SectionType == type);

            if (section == null)
            {
                section = new ContentSection
                {
                    TenantId = tenantId,
                    SectionType = type
                };
                _db.ContentSections.Add(section);
            }

            if (dto.Title != null) section.Title = dto.Title;
            if (dto.Subtitle != null) section.Subtitle = dto.Subtitle;
            if (dto.Body != null) section.Body = dto.Body;
            if (dto.ImageUrl != null) section.ImageUrl = dto.ImageUrl;
            if (dto.SecondaryImageUrl != null) section.SecondaryImageUrl = dto.SecondaryImageUrl;
            if (dto.BadgeText != null) section.BadgeText = dto.BadgeText;
            if (dto.CtaText != null) section.CtaText = dto.CtaText;
            if (dto.CtaUrl != null) section.CtaUrl = dto.CtaUrl;
            if (dto.SecondaryCtaText != null) section.SecondaryCtaText = dto.SecondaryCtaText;
            if (dto.SecondaryCtaUrl != null) section.SecondaryCtaUrl = dto.SecondaryCtaUrl;
            if (dto.JsonData != null) section.JsonData = dto.JsonData;
            if (dto.IsActive.HasValue) section.IsActive = dto.IsActive.Value;

            section.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return MapToDto(section);
        }

        private static ContentSectionDto MapToDto(ContentSection c) => new()
        {
            Id = c.Id,
            SectionType = c.SectionType.ToString(),
            Title = c.Title,
            Subtitle = c.Subtitle,
            Body = c.Body,
            ImageUrl = c.ImageUrl,
            SecondaryImageUrl = c.SecondaryImageUrl,
            BadgeText = c.BadgeText,
            CtaText = c.CtaText,
            CtaUrl = c.CtaUrl,
            SecondaryCtaText = c.SecondaryCtaText,
            SecondaryCtaUrl = c.SecondaryCtaUrl,
            JsonData = c.JsonData,
            IsActive = c.IsActive,
            UpdatedAt = c.UpdatedAt
        };
    }
}
