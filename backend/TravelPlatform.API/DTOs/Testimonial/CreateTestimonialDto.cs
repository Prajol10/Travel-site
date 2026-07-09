using System.ComponentModel.DataAnnotations;

namespace TravelPlatform.API.DTOs.Testimonial
{
    public class CreateTestimonialDto
    {
        [Required]
        public string AuthorName { get; set; } = string.Empty;

        public string? AuthorPhotoUrl { get; set; }
        public string? AuthorLocation { get; set; }
        public string? TourName { get; set; }

        [Required]
        public string ReviewText { get; set; } = string.Empty;

        public double Rating { get; set; } = 5.0;
        public string? ReviewDate { get; set; }
        public string? SourcePlatform { get; set; }
        public int SortOrder { get; set; } = 0;
    }
}
