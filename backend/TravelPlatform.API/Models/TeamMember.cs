namespace TravelPlatform.API.Models
{
    public class TeamMember
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Role { get; set; }
        public string? Region { get; set; }           // "USA Representative"
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? PhotoUrl { get; set; }
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;

        // Navigation
        public Tenant? Tenant { get; set; }
    }
}
