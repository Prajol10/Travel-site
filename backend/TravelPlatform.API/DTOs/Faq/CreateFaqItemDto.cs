using System.ComponentModel.DataAnnotations;
namespace TravelPlatform.API.DTOs.Faq
{
    public class CreateFaqItemDto
    {
        [Required]
        public string Question { get; set; } = string.Empty;
        [Required]
        public string Answer { get; set; } = string.Empty;
        public int SortOrder { get; set; } = 0;
    }
}
