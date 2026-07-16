using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlatform.API.DTOs.WhyChooseUs;
using TravelPlatform.API.Services;
namespace TravelPlatform.API.Controllers
{
    [ApiController]
    [Route("api/whychooseus")]
    public class WhyChooseUsController : ControllerBase
    {
        private readonly WhyChooseUsService _whyChooseUsService;
        public WhyChooseUsController(WhyChooseUsService whyChooseUsService)
        {
            _whyChooseUsService = whyChooseUsService;
        }
        [HttpGet("{tenantId}")]
        public async Task<IActionResult> GetAll(Guid tenantId)
        {
            var items = await _whyChooseUsService.GetAllAsync(tenantId);
            return Ok(new { success = true, data = items });
        }
        [HttpPost]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Create([FromBody] CreateWhyChooseUsItemDto dto)
        {
            var tenantId = GetTenantId();
            var item = await _whyChooseUsService.CreateAsync(tenantId, dto);
            return Ok(new { success = true, data = item });
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var tenantId = GetTenantId();
            await _whyChooseUsService.DeleteAsync(tenantId, id);
            return Ok(new { success = true, message = "Why Choose Us item deleted" });
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
