namespace TravelPlatform.API.DTOs.Content
{
    public class ContentSectionDto
    {
        public Guid Id { get; set; }
        public string SectionType { get; set; } = string.Empty;
        public string? Title { get; set; }
        public string? Subtitle { get; set; }
        public string? Body { get; set; }
        public string? ImageUrl { get; set; }
        public string? SecondaryImageUrl { get; set; }
        public string? BadgeText { get; set; }
        public string? CtaText { get; set; }
        public string? CtaUrl { get; set; }
        public string? SecondaryCtaText { get; set; }
        public string? SecondaryCtaUrl { get; set; }
        public string? JsonData { get; set; }
        public bool IsActive { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
