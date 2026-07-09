using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlatform.API.DTOs.Content;
using TravelPlatform.API.Services;

namespace TravelPlatform.API.Controllers
{
    [ApiController]
    [Route("api/content")]
    public class ContentController : ControllerBase
    {
        private readonly ContentService _contentService;

        public ContentController(ContentService contentService)
        {
            _contentService = contentService;
        }

        [HttpGet("{tenantId}")]
        public async Task<IActionResult> GetAll(Guid tenantId)
        {
            var sections = await _contentService.GetAllAsync(tenantId);
            return Ok(new { success = true, data = sections });
        }

        [HttpGet("{tenantId}/{sectionType}")]
        public async Task<IActionResult> GetByType(Guid tenantId, string sectionType)
        {
            var section = await _contentService.GetBySectionTypeAsync(tenantId, sectionType);
            return Ok(new { success = true, data = section });
        }

        [HttpPut("{sectionType}")]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Upsert(string sectionType, [FromBody] UpdateContentDto dto)
        {
            var tenantId = GetTenantId();
            var section = await _contentService.UpsertAsync(tenantId, sectionType, dto);
            return Ok(new { success = true, data = section });
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
