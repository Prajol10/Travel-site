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
        private static readonly string[] AllowedTypes = { "image/jpeg", "image/png", "image/webp", "image/gif" };

        public UploadsController(SupabaseStorageService storage)
        {
            _storage = storage;
        }

        [HttpPost]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        [RequestSizeLimit(10_000_000)]
        public async Task<IActionResult> Upload(IFormFile file, [FromForm] string? folder, [FromForm] string? tenantId)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "No file provided" });

            if (!AllowedTypes.Contains(file.ContentType))
                return BadRequest(new { success = false, message = "Only image files are allowed (jpeg, png, webp, gif)" });

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
