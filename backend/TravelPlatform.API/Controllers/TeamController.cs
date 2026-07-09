using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlatform.API.DTOs.Team;
using TravelPlatform.API.Services;

namespace TravelPlatform.API.Controllers
{
    [ApiController]
    [Route("api/team")]
    public class TeamController : ControllerBase
    {
        private readonly TeamService _teamService;

        public TeamController(TeamService teamService)
        {
            _teamService = teamService;
        }

        [HttpGet("{tenantId}")]
        public async Task<IActionResult> GetAll(Guid tenantId)
        {
            var members = await _teamService.GetAllAsync(tenantId);
            return Ok(new { success = true, data = members });
        }

        [HttpPost]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Create([FromBody] CreateTeamMemberDto dto)
        {
            var tenantId = GetTenantId();
            var member = await _teamService.CreateAsync(tenantId, dto);
            return Ok(new { success = true, data = member });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var tenantId = GetTenantId();
            await _teamService.DeleteAsync(tenantId, id);
            return Ok(new { success = true, message = "Team member deleted" });
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
