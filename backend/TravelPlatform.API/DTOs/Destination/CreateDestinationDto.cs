using System.ComponentModel.DataAnnotations;
namespace TravelPlatform.API.DTOs.Destination
{
    public class CreateDestinationDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string? Country { get; set; }
        [Required]
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int SortOrder { get; set; } = 0;
    }
}
