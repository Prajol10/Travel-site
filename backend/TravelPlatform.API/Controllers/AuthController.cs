using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlatform.API.DTOs.Auth;
using TravelPlatform.API.Services;

namespace TravelPlatform.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.LoginAsync(request);
            return Ok(new { success = true, data = result });
        }

        // Restricted: previously unauthenticated, allowing anyone to self-register
        // as TenantAdmin for any guessable TenantId. Tenant creation (superadmin flow)
        // already covers legitimate admin provisioning; this is now SuperAdmin-only.
        [HttpPost("register")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _authService.RegisterAsync(request);
            return Ok(new { success = true, data = result });
        }
    }
}
