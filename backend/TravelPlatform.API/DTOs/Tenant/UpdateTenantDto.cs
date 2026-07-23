namespace TravelPlatform.API.DTOs.Tenant
{
    public class UpdateTenantDto
    {
        public string? Name { get; set; }
        public string? Status { get; set; }
        public string? CustomDomain { get; set; }
        public string? LogoUrl { get; set; }
        public string? FaviconUrl { get; set; }
        public string? PrimaryColor { get; set; }
        public string? SecondaryColor { get; set; }
        public string? TagLine { get; set; }
        public string? PhoneNumber { get; set; }
        public string? WhatsAppNumber { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? FacebookUrl { get; set; }
        public string? InstagramUrl { get; set; }
        public string? YouTubeUrl { get; set; }
        public string? TwitterUrl { get; set; }
        public string? DefaultCurrency { get; set; }
        public string? SupportedCurrencies { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? OgImageUrl { get; set; }
        public string? GoogleAnalyticsId { get; set; }
    }
}
