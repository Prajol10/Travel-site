using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlatform.API.DTOs.Destination;
using TravelPlatform.API.Services;
namespace TravelPlatform.API.Controllers
{
    [ApiController]
    [Route("api/destinations")]
    public class DestinationController : ControllerBase
    {
        private readonly DestinationService _destinationService;
        public DestinationController(DestinationService destinationService)
        {
            _destinationService = destinationService;
        }
        [HttpGet("{tenantId}")]
        public async Task<IActionResult> GetAll(Guid tenantId)
        {
            var destinations = await _destinationService.GetAllAsync(tenantId);
            return Ok(new { success = true, data = destinations });
        }
        [HttpPost]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Create([FromBody] CreateDestinationDto dto)
        {
            var tenantId = GetTenantId();
            var destination = await _destinationService.CreateAsync(tenantId, dto);
            return Ok(new { success = true, data = destination });
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var tenantId = GetTenantId();
            await _destinationService.DeleteAsync(tenantId, id);
            return Ok(new { success = true, message = "Destination deleted" });
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
