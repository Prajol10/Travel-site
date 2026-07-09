using TravelPlatform.API.Models.Enums;
namespace TravelPlatform.API.Models
{
    public class TourPackage
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        public Guid? CategoryId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public string? FullDescription { get; set; }
        public string? Highlights { get; set; }  // JSON array
        public string? Itinerary { get; set; }   // JSON array of days
        public string? Inclusions { get; set; }  // JSON array
        public string? Exclusions { get; set; }  // JSON array
        public int DurationDays { get; set; }
        public int DurationNights { get; set; }
        public decimal PriceUSD { get; set; }
        public decimal? PriceINR { get; set; }
        public decimal? PriceEUR { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? ImageUrls { get; set; }   // JSON array
        public TourDifficultyLevel Difficulty { get; set; } = TourDifficultyLevel.Moderate;
        public string? MaxAltitude { get; set; }
        public int? MaxGroupSize { get; set; }
        public double? Rating { get; set; }
        public int? ReviewCount { get; set; }
        public bool IsFeatured { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public int SortOrder { get; set; } = 0;
        public string? SeoTitle { get; set; }
        public string? SeoDescription { get; set; }
        public string? VideoUrl { get; set; }        // YouTube URL or embed ID
        public string? Faqs { get; set; }            // JSON array of {question, answer}
        public string? KnowBeforeYouGo { get; set; } // JSON array of strings
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        // Navigation
        public Tenant? Tenant { get; set; }
        public TourCategory? Category { get; set; }
    }
}
