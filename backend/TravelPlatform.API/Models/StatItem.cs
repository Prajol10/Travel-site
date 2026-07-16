namespace TravelPlatform.API.Models
{
    public class StatItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        public string Value { get; set; } = string.Empty;   // "18+"
        public string Label { get; set; } = string.Empty;   // "Years Experience"
        public string? IconName { get; set; }
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;

        // Navigation
        public Tenant? Tenant { get; set; }
    }
}
