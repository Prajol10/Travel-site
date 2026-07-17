using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlatform.API.DTOs.Faq;
using TravelPlatform.API.Services;
namespace TravelPlatform.API.Controllers
{
    [ApiController]
    [Route("api/faqs")]
    public class FaqItemController : ControllerBase
    {
        private readonly FaqItemService _faqItemService;
        public FaqItemController(FaqItemService faqItemService)
        {
            _faqItemService = faqItemService;
        }
        [HttpGet("{tenantId}")]
        public async Task<IActionResult> GetAll(Guid tenantId)
        {
            var faqs = await _faqItemService.GetAllAsync(tenantId);
            return Ok(new { success = true, data = faqs });
        }
        [HttpPost]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Create([FromBody] CreateFaqItemDto dto)
        {
            var tenantId = GetTenantId();
            var faq = await _faqItemService.CreateAsync(tenantId, dto);
            return Ok(new { success = true, data = faq });
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var tenantId = GetTenantId();
            await _faqItemService.DeleteAsync(tenantId, id);
            return Ok(new { success = true, message = "FAQ deleted" });
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
