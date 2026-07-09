using TravelPlatform.API.Models.Enums;

namespace TravelPlatform.API.Models
{
    public class GalleryItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        public string Url { get; set; } = string.Empty;
        public string? ThumbnailUrl { get; set; }
        public string? Caption { get; set; }
        public GalleryMediaType MediaType { get; set; } = GalleryMediaType.Photo;
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Tenant? Tenant { get; set; }
    }
}
