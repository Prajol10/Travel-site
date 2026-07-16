namespace TravelPlatform.API.DTOs.Stat
{
    public class StatItemDto
    {
        public Guid Id { get; set; }
        public string Value { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string? IconName { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; }
    }
}
