using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlatform.API.DTOs.Tenant;
using TravelPlatform.API.DTOs.User;
using TravelPlatform.API.Services;

namespace TravelPlatform.API.Controllers
{
    [ApiController]
    [Route("api/superadmin")]
    [Authorize(Roles = "SuperAdmin")]
    public class SuperAdminController : ControllerBase
    {
        private readonly TenantService _tenantService;
        private readonly UserService _userService;

        public SuperAdminController(TenantService tenantService, UserService userService)
        {
            _tenantService = tenantService;
            _userService = userService;
        }

        [HttpGet("tenants")]
        public async Task<IActionResult> GetAllTenants()
        {
            var tenants = await _tenantService.GetAllAsync();
            return Ok(new { success = true, data = tenants });
        }

        [HttpGet("tenants/{id}")]
        public async Task<IActionResult> GetTenant(Guid id)
        {
            var tenant = await _tenantService.GetByIdAsync(id);
            return Ok(new { success = true, data = tenant });
        }

        [HttpPost("tenants")]
        public async Task<IActionResult> CreateTenant([FromBody] CreateTenantDto dto)
        {
            var tenant = await _tenantService.CreateAsync(dto);
            return Ok(new { success = true, data = tenant });
        }

        [HttpPut("tenants/{id}")]
        public async Task<IActionResult> UpdateTenant(Guid id, [FromBody] UpdateTenantDto dto)
        {
            var tenant = await _tenantService.UpdateAsync(id, dto);
            return Ok(new { success = true, data = tenant });
        }

        [HttpDelete("tenants/{id}")]
        public async Task<IActionResult> DeleteTenant(Guid id)
        {
            await _tenantService.DeleteAsync(id);
            return Ok(new { success = true, message = "Tenant deleted" });
        }

        [HttpGet("tenants/{tenantId}/users")]
        public async Task<IActionResult> GetTenantUsers(Guid tenantId)
        {
            var users = await _userService.GetByTenantAsync(tenantId);
            return Ok(new { success = true, data = users });
        }

        [HttpPost("tenants/{tenantId}/users")]
        public async Task<IActionResult> CreateTenantUser(Guid tenantId, [FromBody] CreateTenantUserDto dto)
        {
            var user = await _userService.CreateForTenantAsync(tenantId, dto);
            return Ok(new { success = true, data = user });
        }

        [HttpPut("tenants/{tenantId}/users/{userId}/reset-password")]
        public async Task<IActionResult> ResetUserPassword(Guid tenantId, Guid userId, [FromBody] ResetPasswordDto dto)
        {
            await _userService.ResetPasswordAsync(tenantId, userId, dto.NewPassword);
            return Ok(new { success = true, message = "Password reset" });
        }

        [HttpPut("tenants/{tenantId}/users/{userId}/status")]
        public async Task<IActionResult> SetUserStatus(Guid tenantId, Guid userId, [FromBody] SetUserStatusDto dto)
        {
            await _userService.SetStatusAsync(tenantId, userId, dto.IsActive);
            return Ok(new { success = true, message = "User status updated" });
        }
    }
}
