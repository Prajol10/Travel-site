namespace TravelPlatform.API.DTOs.TourCategory
{
    public class UpdateTourCategoryDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? IconUrl { get; set; }
        public int? SortOrder { get; set; }
        public bool? IsActive { get; set; }
    }
}
