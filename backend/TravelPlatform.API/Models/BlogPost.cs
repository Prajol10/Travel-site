using TravelPlatform.API.Models.Enums;

namespace TravelPlatform.API.Models
{
    public class BlogPost
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Excerpt { get; set; }
        public string? Body { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Category { get; set; }
        public BlogStatus Status { get; set; } = BlogStatus.Draft;
        public string? SeoTitle { get; set; }
        public string? SeoDescription { get; set; }
        public DateTime? PublishedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Tenant? Tenant { get; set; }
    }
}
