using TravelPlatform.API.Models.Enums;

namespace TravelPlatform.API.Models
{
    public class Tenant
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Subdomain { get; set; } = string.Empty;
        public string? CustomDomain { get; set; }
        public TenantStatus Status { get; set; } = TenantStatus.Trial;
        public string? LogoUrl { get; set; }
        public string? FaviconUrl { get; set; }
        public string? PrimaryColor { get; set; } = "#C9A84C";
        public string? SecondaryColor { get; set; } = "#1B2B4B";
        public string? TagLine { get; set; }
        public string? PhoneNumber { get; set; }
        public string? WhatsAppNumber { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? FacebookUrl { get; set; }
        public string? InstagramUrl { get; set; }
        public string? YouTubeUrl { get; set; }
        public string? TwitterUrl { get; set; }
        public string? DefaultCurrency { get; set; } = "USD";
        public string? SupportedCurrencies { get; set; } = "USD,INR,EUR";
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? OgImageUrl { get; set; }
        public string? GoogleAnalyticsId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<User> Users { get; set; } = new List<User>();
        public ICollection<TourPackage> TourPackages { get; set; } = new List<TourPackage>();
        public ICollection<ContentSection> ContentSections { get; set; } = new List<ContentSection>();
        public ICollection<Testimonial> Testimonials { get; set; } = new List<Testimonial>();
        public ICollection<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();
        public ICollection<GalleryItem> GalleryItems { get; set; } = new List<GalleryItem>();
        public ICollection<Lead> Leads { get; set; } = new List<Lead>();
        public ICollection<TeamMember> TeamMembers { get; set; } = new List<TeamMember>();
        public ICollection<TourCategory> TourCategories { get; set; } = new List<TourCategory>();
        public ICollection<NavigationItem> NavigationItems { get; set; } = new List<NavigationItem>();
    }
}
