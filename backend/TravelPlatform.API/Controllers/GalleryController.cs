using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlatform.API.DTOs.Gallery;
using TravelPlatform.API.Services;

namespace TravelPlatform.API.Controllers
{
    [ApiController]
    [Route("api/gallery")]
    public class GalleryController : ControllerBase
    {
        private readonly GalleryService _galleryService;

        public GalleryController(GalleryService galleryService)
        {
            _galleryService = galleryService;
        }

        [HttpGet("{tenantId}")]
        public async Task<IActionResult> GetAll(Guid tenantId, [FromQuery] string? mediaType)
        {
            var items = await _galleryService.GetAllAsync(tenantId, mediaType);
            return Ok(new { success = true, data = items });
        }

        [HttpPost]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Add([FromBody] UploadGalleryDto dto)
        {
            var tenantId = GetTenantId();
            var item = await _galleryService.AddAsync(tenantId, dto);
            return Ok(new { success = true, data = item });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var tenantId = GetTenantId();
            await _galleryService.DeleteAsync(tenantId, id);
            return Ok(new { success = true, message = "Gallery item deleted" });
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
