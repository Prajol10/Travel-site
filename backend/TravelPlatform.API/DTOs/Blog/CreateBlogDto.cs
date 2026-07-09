using System.ComponentModel.DataAnnotations;

namespace TravelPlatform.API.DTOs.Blog
{
    public class CreateBlogDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Excerpt { get; set; }
        public string? Body { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Category { get; set; }
        public string? SeoTitle { get; set; }
        public string? SeoDescription { get; set; }
        public bool PublishNow { get; set; } = false;
    }
}
