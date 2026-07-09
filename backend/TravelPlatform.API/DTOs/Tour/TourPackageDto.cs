namespace TravelPlatform.API.DTOs.Tour
{
    public class TourPackageDto
    {
        public Guid Id { get; set; }
        public Guid TenantId { get; set; }
        public Guid? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public string? FullDescription { get; set; }
        public string? Highlights { get; set; }
        public string? Itinerary { get; set; }
        public string? Inclusions { get; set; }
        public string? Exclusions { get; set; }
        public int DurationDays { get; set; }
        public int DurationNights { get; set; }
        public decimal PriceUSD { get; set; }
        public decimal? PriceINR { get; set; }
        public decimal? PriceEUR { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? ImageUrls { get; set; }
        public string? Difficulty { get; set; }
        public string? MaxAltitude { get; set; }
        public int? MaxGroupSize { get; set; }
        public double? Rating { get; set; }
        public int? ReviewCount { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsActive { get; set; }
        public string? SeoTitle { get; set; }
        public string? SeoDescription { get; set; }
        public string? VideoUrl { get; set; }
        public string? Faqs { get; set; }
        public string? KnowBeforeYouGo { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
