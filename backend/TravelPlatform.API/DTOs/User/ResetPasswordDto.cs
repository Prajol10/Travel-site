using System.ComponentModel.DataAnnotations;

namespace TravelPlatform.API.DTOs.User
{
    public class ResetPasswordDto
    {
        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = string.Empty;
    }
}
