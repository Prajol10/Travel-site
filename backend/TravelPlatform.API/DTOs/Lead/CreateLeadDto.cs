using System.ComponentModel.DataAnnotations;

namespace TravelPlatform.API.DTOs.Lead
{
    public class CreateLeadDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        public string? CountryCode { get; set; }
        public string? Message { get; set; }
        public string? TourInterest { get; set; }
        public string? Source { get; set; } = "contact_form";
    }
}
