namespace TravelPlatform.API.DTOs.Blog
{
    public class BlogPostDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Excerpt { get; set; }
        public string? Body { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Category { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? SeoTitle { get; set; }
        public string? SeoDescription { get; set; }
        public DateTime? PublishedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
