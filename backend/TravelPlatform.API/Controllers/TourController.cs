using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlatform.API.DTOs.Tour;
using TravelPlatform.API.Services;

namespace TravelPlatform.API.Controllers
{
    [ApiController]
    [Route("api/tours")]
    public class TourController : ControllerBase
    {
        private readonly TourService _tourService;

        public TourController(TourService tourService)
        {
            _tourService = tourService;
        }

        // Public endpoints
        [HttpGet("{tenantId}")]
        public async Task<IActionResult> GetAll(Guid tenantId, [FromQuery] Guid? categoryId)
        {
            var tours = await _tourService.GetAllAsync(tenantId, categoryId);
            return Ok(new { success = true, data = tours });
        }

        [HttpGet("{tenantId}/slug/{slug}")]
        public async Task<IActionResult> GetBySlug(Guid tenantId, string slug)
        {
            var tour = await _tourService.GetBySlugAsync(tenantId, slug);
            return Ok(new { success = true, data = tour });
        }

        // Admin: get single tour by ID (tenant-scoped via JWT)
        [HttpGet("id/{id}")]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var tenantId = GetTenantId();
            var tour = await _tourService.GetByIdAsync(tenantId, id);
            return Ok(new { success = true, data = tour });
        }

        // Admin endpoints
        [HttpPost]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Create([FromBody] CreateTourDto dto)
        {
            var tenantId = GetTenantId();
            var tour = await _tourService.CreateAsync(tenantId, dto);
            return Ok(new { success = true, data = tour });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTourDto dto)
        {
            var tenantId = GetTenantId();
            var tour = await _tourService.UpdateAsync(tenantId, id, dto);
            return Ok(new { success = true, data = tour });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var tenantId = GetTenantId();
            await _tourService.DeleteAsync(tenantId, id);
            return Ok(new { success = true, message = "Tour deleted" });
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
