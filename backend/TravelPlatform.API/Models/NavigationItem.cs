namespace TravelPlatform.API.Models
{
    public class NavigationItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TenantId { get; set; }
        public Guid? ParentId { get; set; }
        public string Label { get; set; } = string.Empty;
        public string? Url { get; set; }
        public bool IsExternal { get; set; } = false;
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;

        // Navigation
        public Tenant? Tenant { get; set; }
        public NavigationItem? Parent { get; set; }
        public ICollection<NavigationItem> Children { get; set; } = new List<NavigationItem>();
    }
}
