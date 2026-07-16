using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlatform.API.Services;

namespace TravelPlatform.API.Controllers
{
    [ApiController]
    [Route("api/uploads")]
    public class UploadsController : ControllerBase
    {
        private readonly SupabaseStorageService _storage;
        private static readonly string[] AllowedImageTypes = { "image/jpeg", "image/png", "image/webp", "image/gif" };
        private static readonly string[] AllowedVideoTypes = { "video/mp4", "video/webm", "video/quicktime" };

        public UploadsController(SupabaseStorageService storage)
        {
            _storage = storage;
        }

        [HttpPost]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        [RequestSizeLimit(50_000_000)]
        public async Task<IActionResult> Upload(IFormFile file, [FromForm] string? folder, [FromForm] string? tenantId)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "No file provided" });

            var isImage = AllowedImageTypes.Contains(file.ContentType);
            var isVideo = AllowedVideoTypes.Contains(file.ContentType);
            if (!isImage && !isVideo)
                return BadRequest(new { success = false, message = "Only image files (jpeg, png, webp, gif) or video files (mp4, webm, mov) are allowed" });
            if (isImage && file.Length > 10_000_000)
                return BadRequest(new { success = false, message = "Image files must be under 10MB" });
            if (isVideo && file.Length > 50_000_000)
                return BadRequest(new { success = false, message = "Video files must be under 50MB" });

            Guid resolvedTenantId;
            if (User.IsInRole("SuperAdmin") && !string.IsNullOrWhiteSpace(tenantId))
            {
                if (!Guid.TryParse(tenantId, out resolvedTenantId))
                    return BadRequest(new { success = false, message = "Invalid tenantId" });
            }
            else
            {
                resolvedTenantId = GetTenantId();
            }

            var folderPath = string.IsNullOrWhiteSpace(folder)
                ? $"{resolvedTenantId}/general"
                : $"{resolvedTenantId}/{folder.Trim('/')}";

            var url = await _storage.UploadAsync(file, folderPath);
            return Ok(new { success = true, data = new { url } });
        }

        private Guid GetTenantId()
        {
            var tenantIdClaim = User.FindFirst("tenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim) || !Guid.TryParse(tenantIdClaim, out var tenantId))
                throw new UnauthorizedAccessException("Tenant not found in token");
            return tenantId;
        }
    }
}
