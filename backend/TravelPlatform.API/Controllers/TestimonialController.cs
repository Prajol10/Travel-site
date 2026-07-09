using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlatform.API.DTOs.Testimonial;
using TravelPlatform.API.Services;

namespace TravelPlatform.API.Controllers
{
    [ApiController]
    [Route("api/testimonials")]
    public class TestimonialController : ControllerBase
    {
        private readonly TestimonialService _testimonialService;

        public TestimonialController(TestimonialService testimonialService)
        {
            _testimonialService = testimonialService;
        }

        [HttpGet("{tenantId}")]
        public async Task<IActionResult> GetAll(Guid tenantId)
        {
            var items = await _testimonialService.GetAllAsync(tenantId);
            return Ok(new { success = true, data = items });
        }

        [HttpPost]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Create([FromBody] CreateTestimonialDto dto)
        {
            var tenantId = GetTenantId();
            var item = await _testimonialService.CreateAsync(tenantId, dto);
            return Ok(new { success = true, data = item });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var tenantId = GetTenantId();
            await _testimonialService.DeleteAsync(tenantId, id);
            return Ok(new { success = true, message = "Testimonial deleted" });
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
