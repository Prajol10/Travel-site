namespace TravelPlatform.API.DTOs.Lead
{
    public class UpdateLeadStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }
}
