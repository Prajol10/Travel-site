using System.ComponentModel.DataAnnotations;
namespace TravelPlatform.API.DTOs.Stat
{
    public class CreateStatItemDto
    {
        [Required]
        public string Value { get; set; } = string.Empty;
        [Required]
        public string Label { get; set; } = string.Empty;
        public string? IconName { get; set; }
        public int SortOrder { get; set; } = 0;
    }
}
