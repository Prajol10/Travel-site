using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TravelPlatform.API.Data;
using TravelPlatform.API.Services;

namespace TravelPlatform.API.Controllers
{
    [ApiController]
    [Route("api/public")]
    public class PublicController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly TourService _tourService;
        private readonly ContentService _contentService;
        private readonly TestimonialService _testimonialService;
        private readonly GalleryService _galleryService;
        private readonly TeamService _teamService;
        private readonly BlogService _blogService;

        public PublicController(
            AppDbContext db,
            TourService tourService,
            ContentService contentService,
            TestimonialService testimonialService,
            GalleryService galleryService,
            TeamService teamService,
            BlogService blogService)
        {
            _db = db;
            _tourService = tourService;
            _contentService = contentService;
            _testimonialService = testimonialService;
            _galleryService = galleryService;
            _teamService = teamService;
            _blogService = blogService;
        }

        [HttpGet("{subdomain}/homepage")]
        public async Task<IActionResult> GetHomepage(string subdomain)
        {
            var tenant = await _db.Tenants
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Subdomain == subdomain);

            if (tenant == null)
                return NotFound(new { success = false, message = "Agency not found" });

            var tenantId = tenant.Id;

            var content = await _contentService.GetAllAsync(tenantId);
            var tours = await _tourService.GetAllAsync(tenantId);
            var testimonials = await _testimonialService.GetAllAsync(tenantId);
            var gallery = await _galleryService.GetAllAsync(tenantId);
            var team = await _teamService.GetAllAsync(tenantId);
            var blogs = await _blogService.GetAllAsync(tenantId);

            var stats = await _db.StatItems
                .AsNoTracking()
                .Where(s => s.TenantId == tenantId && s.IsActive)
                .OrderBy(s => s.SortOrder)
                .Select(s => new { s.Id, s.Value, s.Label, s.IconName, s.SortOrder, s.IsActive })
                .ToListAsync();

            var whyChooseUs = await _db.WhyChooseUsItems
                .AsNoTracking()
                .Where(w => w.TenantId == tenantId && w.IsActive)
                .OrderBy(w => w.SortOrder)
                .Select(w => new { w.Id, w.Title, w.Description, w.IconName, w.SortOrder, w.IsActive })
                .ToListAsync();

            var destinations = await _db.Destinations
                .AsNoTracking()
                .Where(d => d.TenantId == tenantId && d.IsActive)
                .OrderBy(d => d.SortOrder)
                .Select(d => new { d.Id, d.Name, d.Country, d.Description, d.ImageUrl, d.SortOrder, d.IsActive })
                .ToListAsync();

            var tenantData = new
            {
                tenant.Id,
                tenant.Name,
                tenant.Subdomain,
                tenant.LogoUrl,
                tenant.FaviconUrl,
                tenant.PrimaryColor,
                tenant.SecondaryColor,
                tenant.TagLine,
                tenant.PhoneNumber,
                tenant.WhatsAppNumber,
                tenant.Email,
                tenant.Address,
                tenant.FacebookUrl,
                tenant.InstagramUrl,
                tenant.YouTubeUrl,
                tenant.TwitterUrl,
                tenant.DefaultCurrency,
                tenant.SupportedCurrencies,
                tenant.MetaTitle,
                tenant.MetaDescription,
                tenant.OgImageUrl
            };

            var result = new
            {
                success = true,
                data = new
                {
                    tenant = tenantData,
                    content,
                    tours,
                    testimonials,
                    gallery,
                    team,
                    blogs,
                    stats,
                    whyChooseUs,
                    destinations
                }
            };

            var json = JsonSerializer.Serialize(result, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                MaxDepth = 32,
                ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles
            });

            return Content(json, "application/json");
        }

        [HttpGet("{subdomain}")]
        public async Task<IActionResult> GetTenant(string subdomain)
        {
            var tenant = await _db.Tenants
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Subdomain == subdomain);

            if (tenant == null)
                return NotFound(new { success = false, message = "Agency not found" });

            return Ok(new { success = true, data = tenant });
        }
    }
}
