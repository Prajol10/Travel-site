using TravelPlatform.API.Models.Enums;

namespace TravelPlatform.API.Models
{
    public class ContentSection
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        public ContentSectionType SectionType { get; set; }
        public string? Title { get; set; }
        public string? Subtitle { get; set; }
        public string? Body { get; set; }
        public string? ImageUrl { get; set; }
        public string? SecondaryImageUrl { get; set; }
        public string? BadgeText { get; set; }       // "SACRED HIMALAYAN JOURNEY!"
        public string? CtaText { get; set; }
        public string? CtaUrl { get; set; }
        public string? SecondaryCtaText { get; set; }
        public string? SecondaryCtaUrl { get; set; }
        public string? JsonData { get; set; }        // flexible extra fields
        public bool IsActive { get; set; } = true;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Tenant? Tenant { get; set; }
    }
}
