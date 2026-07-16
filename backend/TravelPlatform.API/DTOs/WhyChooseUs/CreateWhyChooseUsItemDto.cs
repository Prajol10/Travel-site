using System.ComponentModel.DataAnnotations;
namespace TravelPlatform.API.DTOs.WhyChooseUs
{
    public class CreateWhyChooseUsItemDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;
        public string? IconName { get; set; }
        public int SortOrder { get; set; } = 0;
    }
}
