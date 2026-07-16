using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlatform.API.DTOs.Stat;
using TravelPlatform.API.Services;
namespace TravelPlatform.API.Controllers
{
    [ApiController]
    [Route("api/stats")]
    public class StatItemController : ControllerBase
    {
        private readonly StatItemService _statItemService;
        public StatItemController(StatItemService statItemService)
        {
            _statItemService = statItemService;
        }
        [HttpGet("{tenantId}")]
        public async Task<IActionResult> GetAll(Guid tenantId)
        {
            var stats = await _statItemService.GetAllAsync(tenantId);
            return Ok(new { success = true, data = stats });
        }
        [HttpPost]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Create([FromBody] CreateStatItemDto dto)
        {
            var tenantId = GetTenantId();
            var stat = await _statItemService.CreateAsync(tenantId, dto);
            return Ok(new { success = true, data = stat });
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var tenantId = GetTenantId();
            await _statItemService.DeleteAsync(tenantId, id);
            return Ok(new { success = true, message = "Stat item deleted" });
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
