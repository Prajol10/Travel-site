using System.ComponentModel.DataAnnotations;

namespace TravelPlatform.API.DTOs.Tour
{
    public class CreateTourDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public Guid? CategoryId { get; set; }
        public string? ShortDescription { get; set; }
        public string? FullDescription { get; set; }
        public string? Highlights { get; set; }
        public string? Itinerary { get; set; }
        public string? Inclusions { get; set; }
        public string? Exclusions { get; set; }

        [Required]
        public int DurationDays { get; set; }

        [Required]
        public int DurationNights { get; set; }

        [Required]
        public decimal PriceUSD { get; set; }

        public decimal? PriceINR { get; set; }
        public decimal? PriceEUR { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? ImageUrls { get; set; }
        public string? Difficulty { get; set; } = "Moderate";
        public string? MaxAltitude { get; set; }
        public int? MaxGroupSize { get; set; }
        public bool IsFeatured { get; set; } = false;
        public string? SeoTitle { get; set; }
        public string? SeoDescription { get; set; }
        public string? VideoUrl { get; set; }
        public string? Faqs { get; set; }
        public string? KnowBeforeYouGo { get; set; }
    }
}
