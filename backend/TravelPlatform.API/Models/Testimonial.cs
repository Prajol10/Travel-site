namespace TravelPlatform.API.Models
{
    public class Testimonial
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string? AuthorPhotoUrl { get; set; }
        public string? AuthorLocation { get; set; }
        public string? TourName { get; set; }
        public string ReviewText { get; set; } = string.Empty;
        public double Rating { get; set; } = 5.0;
        public string? ReviewDate { get; set; }
        public string? SourcePlatform { get; set; }  // "Google", "TripAdvisor"
        public bool IsActive { get; set; } = true;
        public int SortOrder { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Tenant? Tenant { get; set; }
    }
}
