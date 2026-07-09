using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelPlatform.API.DTOs.Blog;
using TravelPlatform.API.Services;

namespace TravelPlatform.API.Controllers
{
    [ApiController]
    [Route("api/blog")]
    public class BlogController : ControllerBase
    {
        private readonly BlogService _blogService;

        public BlogController(BlogService blogService)
        {
            _blogService = blogService;
        }

        [HttpGet("{tenantId}")]
        public async Task<IActionResult> GetAll(Guid tenantId)
        {
            var posts = await _blogService.GetAllAsync(tenantId);
            return Ok(new { success = true, data = posts });
        }

        [HttpGet("{tenantId}/slug/{slug}")]
        public async Task<IActionResult> GetBySlug(Guid tenantId, string slug)
        {
            var post = await _blogService.GetBySlugAsync(tenantId, slug);
            return Ok(new { success = true, data = post });
        }

        [HttpPost]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Create([FromBody] CreateBlogDto dto)
        {
            var tenantId = GetTenantId();
            var post = await _blogService.CreateAsync(tenantId, dto);
            return Ok(new { success = true, data = post });
        }

        [HttpPut("{id}/publish")]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Publish(Guid id)
        {
            var tenantId = GetTenantId();
            var post = await _blogService.PublishAsync(tenantId, id);
            return Ok(new { success = true, data = post });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "TenantAdmin,SuperAdmin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var tenantId = GetTenantId();
            await _blogService.DeleteAsync(tenantId, id);
            return Ok(new { success = true, message = "Post deleted" });
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
