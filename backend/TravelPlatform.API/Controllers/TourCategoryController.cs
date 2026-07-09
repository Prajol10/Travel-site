using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlatform.API.DTOs.TourCategory;
using TravelPlatform.API.Services;

namespace TravelPlatform.API.Controllers
{
    [ApiController]
    [Route("api/tour-categories")]
    public class TourCategoryController : ControllerBase
    {
        private readonly TourCategoryService _categoryService;

        public TourCategoryController(TourCategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet("{tenantId}")]
        public async Task<IActionResult> GetAll(Guid tenantId, [FromQuery] bool activeOnly = false)
        {
            var categories = await _categoryService.GetAllAsync(tenantId, activeOnly);
            return Ok(new { success = true, data = categories });
        }

        [HttpPost]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Create([FromBody] CreateTourCategoryDto dto)
        {
            var tenantId = GetTenantId();
            var category = await _categoryService.CreateAsync(tenantId, dto);
            return Ok(new { success = true, data = category });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTourCategoryDto dto)
        {
            var tenantId = GetTenantId();
            var category = await _categoryService.UpdateAsync(tenantId, id, dto);
            return Ok(new { success = true, data = category });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var tenantId = GetTenantId();
            await _categoryService.DeleteAsync(tenantId, id);
            return Ok(new { success = true, message = "Category deleted" });
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
