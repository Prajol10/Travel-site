namespace TravelPlatform.API.Models
{
    public class FaqItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        // Navigation
        public Tenant? Tenant { get; set; }
    }
}
