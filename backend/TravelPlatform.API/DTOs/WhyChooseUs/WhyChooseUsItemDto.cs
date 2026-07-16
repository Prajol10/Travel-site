namespace TravelPlatform.API.DTOs.WhyChooseUs
{
    public class WhyChooseUsItemDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? IconName { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }
}
