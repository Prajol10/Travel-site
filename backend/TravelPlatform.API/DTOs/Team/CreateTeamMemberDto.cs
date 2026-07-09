using System.ComponentModel.DataAnnotations;

namespace TravelPlatform.API.DTOs.Team
{
    public class CreateTeamMemberDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        public string? Role { get; set; }
        public string? Region { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? PhotoUrl { get; set; }
        public int SortOrder { get; set; } = 0;
    }
}
