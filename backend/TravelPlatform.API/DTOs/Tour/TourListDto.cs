namespace TravelPlatform.API.DTOs.Tour
{
    public class TourListDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public string? CoverImageUrl { get; set; }
        public int DurationDays { get; set; }
        public int DurationNights { get; set; }
        public decimal PriceUSD { get; set; }
        public decimal? PriceINR { get; set; }
        public decimal? PriceEUR { get; set; }
        public string? CategoryName { get; set; }
        public string? Difficulty { get; set; }
        public double? Rating { get; set; }
        public int? ReviewCount { get; set; }
        public bool IsFeatured { get; set; }
    }
}
