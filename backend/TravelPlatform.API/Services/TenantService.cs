using Microsoft.EntityFrameworkCore;
using TravelPlatform.API.Data;
using TravelPlatform.API.DTOs.Tenant;
using TravelPlatform.API.Helpers;
using TravelPlatform.API.Models;
using TravelPlatform.API.Models.Enums;

namespace TravelPlatform.API.Services
{
    public class TenantService
    {
        private readonly AppDbContext _db;
        private readonly AuthService _authService;

        public TenantService(AppDbContext db, AuthService authService)
        {
            _db = db;
            _authService = authService;
        }

        public async Task<List<TenantDto>> GetAllAsync()
        {
            return await _db.Tenants
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => MapToDto(t))
                .ToListAsync();
        }

        public async Task<TenantDto> GetByIdAsync(Guid id)
        {
            var tenant = await _db.Tenants.FindAsync(id)
                ?? throw new KeyNotFoundException("Tenant not found");
            return MapToDto(tenant);
        }

        public async Task<TenantDto> GetBySubdomainAsync(string subdomain)
        {
            var tenant = await _db.Tenants
                .FirstOrDefaultAsync(t => t.Subdomain == subdomain)
                ?? throw new KeyNotFoundException("Tenant not found");
            return MapToDto(tenant);
        }

        public async Task<TenantDto> CreateAsync(CreateTenantDto dto)
        {
            var exists = await _db.Tenants.AnyAsync(t => t.Subdomain == dto.Subdomain);
            if (exists)
                throw new ArgumentException("Subdomain already taken");

            var tenant = new Tenant
            {
                Name = dto.Name,
                Subdomain = dto.Subdomain.ToLower().Trim(),
                PrimaryColor = dto.PrimaryColor ?? "#C9A84C",
                SecondaryColor = dto.SecondaryColor ?? "#1B2B4B",
                TagLine = dto.TagLine,
                PhoneNumber = dto.PhoneNumber,
                WhatsAppNumber = dto.WhatsAppNumber,
                DefaultCurrency = dto.DefaultCurrency ?? "USD",
                Status = TenantStatus.Active
            };

            _db.Tenants.Add(tenant);
            await _db.SaveChangesAsync();

            // Create admin user for this tenant
            if (!string.IsNullOrEmpty(dto.AdminEmail) && !string.IsNullOrEmpty(dto.AdminPassword))
            {
                await _authService.RegisterAsync(new DTOs.Auth.RegisterRequest
                {
                    FullName = dto.AdminFullName ?? "Admin",
                    Email = dto.AdminEmail,
                    Password = dto.AdminPassword,
                    TenantId = tenant.Id
                }, UserRole.TenantAdmin);
            }

            return MapToDto(tenant);
        }

        public async Task<TenantDto> UpdateAsync(Guid id, UpdateTenantDto dto)
        {
            var tenant = await _db.Tenants.FindAsync(id)
                ?? throw new KeyNotFoundException("Tenant not found");

            if (dto.Name != null) tenant.Name = dto.Name;
            if (dto.CustomDomain != null) tenant.CustomDomain = dto.CustomDomain;
            if (dto.LogoUrl != null) tenant.LogoUrl = dto.LogoUrl;
            if (dto.FaviconUrl != null) tenant.FaviconUrl = dto.FaviconUrl;
            if (dto.PrimaryColor != null) tenant.PrimaryColor = dto.PrimaryColor;
            if (dto.SecondaryColor != null) tenant.SecondaryColor = dto.SecondaryColor;
            if (dto.TagLine != null) tenant.TagLine = dto.TagLine;
            if (dto.PhoneNumber != null) tenant.PhoneNumber = dto.PhoneNumber;
            if (dto.WhatsAppNumber != null) tenant.WhatsAppNumber = dto.WhatsAppNumber;
            if (dto.Email != null) tenant.Email = dto.Email;
            if (dto.Address != null) tenant.Address = dto.Address;
            if (dto.FacebookUrl != null) tenant.FacebookUrl = dto.FacebookUrl;
            if (dto.InstagramUrl != null) tenant.InstagramUrl = dto.InstagramUrl;
            if (dto.YouTubeUrl != null) tenant.YouTubeUrl = dto.YouTubeUrl;
            if (dto.TwitterUrl != null) tenant.TwitterUrl = dto.TwitterUrl;
            if (dto.DefaultCurrency != null) tenant.DefaultCurrency = dto.DefaultCurrency;
            if (dto.SupportedCurrencies != null) tenant.SupportedCurrencies = dto.SupportedCurrencies;
            if (dto.MetaTitle != null) tenant.MetaTitle = dto.MetaTitle;
            if (dto.MetaDescription != null) tenant.MetaDescription = dto.MetaDescription;
            if (dto.OgImageUrl != null) tenant.OgImageUrl = dto.OgImageUrl;
            if (dto.GoogleAnalyticsId != null) tenant.GoogleAnalyticsId = dto.GoogleAnalyticsId;

            tenant.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return MapToDto(tenant);
        }

        public async Task DeleteAsync(Guid id)
        {
            var tenant = await _db.Tenants.FindAsync(id)
                ?? throw new KeyNotFoundException("Tenant not found");
            _db.Tenants.Remove(tenant);
            await _db.SaveChangesAsync();
        }

        private static TenantDto MapToDto(Tenant t) => new()
        {
            Id = t.Id,
            Name = t.Name,
            Subdomain = t.Subdomain,
            CustomDomain = t.CustomDomain,
            Status = t.Status.ToString(),
            LogoUrl = t.LogoUrl,
            FaviconUrl = t.FaviconUrl,
            PrimaryColor = t.PrimaryColor,
            SecondaryColor = t.SecondaryColor,
            TagLine = t.TagLine,
            PhoneNumber = t.PhoneNumber,
            WhatsAppNumber = t.WhatsAppNumber,
            Email = t.Email,
            Address = t.Address,
            FacebookUrl = t.FacebookUrl,
            InstagramUrl = t.InstagramUrl,
            YouTubeUrl = t.YouTubeUrl,
            TwitterUrl = t.TwitterUrl,
            DefaultCurrency = t.DefaultCurrency,
            SupportedCurrencies = t.SupportedCurrencies,
            MetaTitle = t.MetaTitle,
            MetaDescription = t.MetaDescription,
            OgImageUrl = t.OgImageUrl,
            GoogleAnalyticsId = t.GoogleAnalyticsId,
            CreatedAt = t.CreatedAt
        };
    }
}
