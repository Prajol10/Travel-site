using System.ComponentModel.DataAnnotations;

namespace TravelPlatform.API.DTOs.Tenant
{
    public class CreateTenantDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Subdomain { get; set; } = string.Empty;

        public string? AdminFullName { get; set; }

        [EmailAddress]
        public string? AdminEmail { get; set; }

        public string? AdminPassword { get; set; }

        public string? PrimaryColor { get; set; } = "#C9A84C";
        public string? SecondaryColor { get; set; } = "#1B2B4B";
        public string? TagLine { get; set; }
        public string? PhoneNumber { get; set; }
        public string? WhatsAppNumber { get; set; }
        public string? DefaultCurrency { get; set; } = "USD";
    }
}
