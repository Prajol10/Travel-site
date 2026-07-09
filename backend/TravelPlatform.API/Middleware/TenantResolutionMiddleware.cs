using Microsoft.EntityFrameworkCore;
using TravelPlatform.API.Data;

namespace TravelPlatform.API.Middleware
{
    public class TenantResolutionMiddleware
    {
        private readonly RequestDelegate _next;

        public TenantResolutionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, AppDbContext db)
        {
            var host = context.Request.Host.Host;

            // Extract subdomain from host
            // e.g. "kailash.yourdomain.com" → "kailash"
            var subdomain = ExtractSubdomain(host);

            if (!string.IsNullOrEmpty(subdomain))
            {
                var tenant = await db.Tenants
                    .FirstOrDefaultAsync(t =>
                        t.Subdomain == subdomain &&
                        t.Status == Models.Enums.TenantStatus.Active);

                if (tenant != null)
                {
                    context.Items["TenantId"] = tenant.Id;
                    context.Items["Tenant"] = tenant;
                }
            }

            await _next(context);
        }

        private static string? ExtractSubdomain(string host)
        {
            // Remove port if present
            host = host.Split(':')[0];

            var parts = host.Split('.');

            // Needs at least 3 parts: subdomain.domain.tld
            if (parts.Length >= 3)
                return parts[0];

            return null;
        }
    }
}
