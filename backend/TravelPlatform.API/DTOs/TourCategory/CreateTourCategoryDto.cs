using System.ComponentModel.DataAnnotations;

namespace TravelPlatform.API.DTOs.TourCategory
{
    public class CreateTourCategoryDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? IconUrl { get; set; }
        public int SortOrder { get; set; } = 0;
    }
}
