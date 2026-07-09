using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlatform.API.DTOs.Tenant;
using TravelPlatform.API.Services;
using System.Security.Claims;

namespace TravelPlatform.API.Controllers
{
    [ApiController]
    [Route("api/tenant")]
    [Authorize(Roles = "TenantAdmin,SuperAdmin")]
    public class TenantController : ControllerBase
    {
        private readonly TenantService _tenantService;

        public TenantController(TenantService tenantService)
        {
            _tenantService = tenantService;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyTenant()
        {
            var tenantId = GetTenantId();
            var tenant = await _tenantService.GetByIdAsync(tenantId);
            return Ok(new { success = true, data = tenant });
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyTenant([FromBody] UpdateTenantDto dto)
        {
            var tenantId = GetTenantId();
            var tenant = await _tenantService.UpdateAsync(tenantId, dto);
            return Ok(new { success = true, data = tenant });
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
