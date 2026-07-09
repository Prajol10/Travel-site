using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlatform.API.DTOs.Lead;
using TravelPlatform.API.Services;

namespace TravelPlatform.API.Controllers
{
    [ApiController]
    [Route("api/leads")]
    public class LeadController : ControllerBase
    {
        private readonly LeadService _leadService;

        public LeadController(LeadService leadService)
        {
            _leadService = leadService;
        }

        [HttpPost("{tenantId}")]
        public async Task<IActionResult> Create(Guid tenantId, [FromBody] CreateLeadDto dto)
        {
            var lead = await _leadService.CreateAsync(tenantId, dto);
            return Ok(new { success = true, data = lead });
        }

        [HttpGet]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> GetAll([FromQuery] string? status)
        {
            var tenantId = GetTenantId();
            var leads = await _leadService.GetAllAsync(tenantId, status);
            return Ok(new { success = true, data = leads });
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateLeadStatusDto dto)
        {
            var tenantId = GetTenantId();
            var lead = await _leadService.UpdateStatusAsync(tenantId, id, dto);
            return Ok(new { success = true, data = lead });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var tenantId = GetTenantId();
            await _leadService.DeleteAsync(tenantId, id);
            return Ok(new { success = true, message = "Lead deleted" });
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
