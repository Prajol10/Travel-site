namespace TravelPlatform.API.DTOs.Testimonial
{
    public class TestimonialDto
    {
        public Guid Id { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string? AuthorPhotoUrl { get; set; }
        public string? AuthorLocation { get; set; }
        public string? TourName { get; set; }
        public string ReviewText { get; set; } = string.Empty;
        public double Rating { get; set; }
        public string? ReviewDate { get; set; }
        public string? SourcePlatform { get; set; }
        public bool IsActive { get; set; }
        public int SortOrder { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
