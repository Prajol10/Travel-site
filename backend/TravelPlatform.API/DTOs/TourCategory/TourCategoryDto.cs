namespace TravelPlatform.API.DTOs.TourCategory
{
    public class TourCategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? IconUrl { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
        public int TourCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
