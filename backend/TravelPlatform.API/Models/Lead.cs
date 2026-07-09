using TravelPlatform.API.Models.Enums;

namespace TravelPlatform.API.Models
{
    public class Lead
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? CountryCode { get; set; }
        public string? Message { get; set; }
        public string? TourInterest { get; set; }
        public LeadStatus Status { get; set; } = LeadStatus.New;
        public string? Notes { get; set; }
        public string? Source { get; set; }           // "contact_form", "whatsapp"
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Tenant? Tenant { get; set; }
    }
}
