using Microsoft.EntityFrameworkCore;
using TravelPlatform.API.Data;
using TravelPlatform.API.DTOs.Tour;
using TravelPlatform.API.Helpers;
using TravelPlatform.API.Models;
using TravelPlatform.API.Models.Enums;

namespace TravelPlatform.API.Services
{
    public class TourService
    {
        private readonly AppDbContext _db;

        public TourService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<TourListDto>> GetAllAsync(Guid tenantId, Guid? categoryId = null, bool activeOnly = true)
        {
            var query = _db.TourPackages
                .Include(t => t.Category)
                .Where(t => t.TenantId == tenantId);

            if (activeOnly) query = query.Where(t => t.IsActive);
            if (categoryId.HasValue) query = query.Where(t => t.CategoryId == categoryId);

            return await query
                .OrderBy(t => t.SortOrder)
                .ThenByDescending(t => t.CreatedAt)
                .Select(t => new TourListDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Slug = t.Slug,
                    ShortDescription = t.ShortDescription,
                    CoverImageUrl = t.CoverImageUrl,
                    DurationDays = t.DurationDays,
                    DurationNights = t.DurationNights,
                    PriceUSD = t.PriceUSD,
                    PriceINR = t.PriceINR,
                    PriceEUR = t.PriceEUR,
                    CategoryName = t.Category != null ? t.Category.Name : null,
                    Difficulty = t.Difficulty.ToString(),
                    Rating = t.Rating,
                    ReviewCount = t.ReviewCount,
                    IsFeatured = t.IsFeatured
                })
                .ToListAsync();
        }

        public async Task<TourPackageDto> GetBySlugAsync(Guid tenantId, string slug)
        {
            var tour = await _db.TourPackages
                .Include(t => t.Category)
                .FirstOrDefaultAsync(t => t.TenantId == tenantId && t.Slug == slug)
                ?? throw new KeyNotFoundException("Tour not found");

            return MapToDto(tour);
        }

        public async Task<TourPackageDto> GetByIdAsync(Guid tenantId, Guid id)
        {
            var tour = await _db.TourPackages
                .Include(t => t.Category)
                .FirstOrDefaultAsync(t => t.TenantId == tenantId && t.Id == id)
                ?? throw new KeyNotFoundException("Tour not found");

            return MapToDto(tour);
        }

        public async Task<TourPackageDto> CreateAsync(Guid tenantId, CreateTourDto dto)
        {
            var existingSlugs = await _db.TourPackages
                .Where(t => t.TenantId == tenantId)
                .Select(t => t.Slug)
                .ToListAsync();

            var slug = SlugHelper.GenerateUnique(dto.Title, existingSlugs);

            var tour = new TourPackage
            {
                TenantId = tenantId,
                CategoryId = dto.CategoryId,
                Title = dto.Title,
                Slug = slug,
                ShortDescription = dto.ShortDescription,
                FullDescription = dto.FullDescription,
                Highlights = dto.Highlights,
                Itinerary = dto.Itinerary,
                Inclusions = dto.Inclusions,
                Exclusions = dto.Exclusions,
                DurationDays = dto.DurationDays,
                DurationNights = dto.DurationNights,
                PriceUSD = dto.PriceUSD,
                PriceINR = dto.PriceINR,
                PriceEUR = dto.PriceEUR,
                CoverImageUrl = dto.CoverImageUrl,
                ImageUrls = dto.ImageUrls,
                Difficulty = Enum.TryParse<TourDifficultyLevel>(dto.Difficulty, out var diff)
                    ? diff : TourDifficultyLevel.Moderate,
                MaxAltitude = dto.MaxAltitude,
                MaxGroupSize = dto.MaxGroupSize,
                IsFeatured = dto.IsFeatured,
                SeoTitle = dto.SeoTitle,
                SeoDescription = dto.SeoDescription,
                VideoUrl = dto.VideoUrl,
                Faqs = dto.Faqs,
                KnowBeforeYouGo = dto.KnowBeforeYouGo
            };

            _db.TourPackages.Add(tour);
            await _db.SaveChangesAsync();

            return MapToDto(tour);
        }

        public async Task<TourPackageDto> UpdateAsync(Guid tenantId, Guid id, UpdateTourDto dto)
        {
            var tour = await _db.TourPackages
                .FirstOrDefaultAsync(t => t.TenantId == tenantId && t.Id == id)
                ?? throw new KeyNotFoundException("Tour not found");

            if (dto.Title != null) tour.Title = dto.Title;
            if (dto.CategoryId.HasValue) tour.CategoryId = dto.CategoryId;
            if (dto.ShortDescription != null) tour.ShortDescription = dto.ShortDescription;
            if (dto.FullDescription != null) tour.FullDescription = dto.FullDescription;
            if (dto.Highlights != null) tour.Highlights = dto.Highlights;
            if (dto.Itinerary != null) tour.Itinerary = dto.Itinerary;
            if (dto.Inclusions != null) tour.Inclusions = dto.Inclusions;
            if (dto.Exclusions != null) tour.Exclusions = dto.Exclusions;
            if (dto.DurationDays.HasValue) tour.DurationDays = dto.DurationDays.Value;
            if (dto.DurationNights.HasValue) tour.DurationNights = dto.DurationNights.Value;
            if (dto.PriceUSD.HasValue) tour.PriceUSD = dto.PriceUSD.Value;
            if (dto.PriceINR.HasValue) tour.PriceINR = dto.PriceINR;
            if (dto.PriceEUR.HasValue) tour.PriceEUR = dto.PriceEUR;
            if (dto.CoverImageUrl != null) tour.CoverImageUrl = dto.CoverImageUrl;
            if (dto.ImageUrls != null) tour.ImageUrls = dto.ImageUrls;
            if (dto.Difficulty != null && Enum.TryParse<TourDifficultyLevel>(dto.Difficulty, out var diff))
                tour.Difficulty = diff;
            if (dto.MaxAltitude != null) tour.MaxAltitude = dto.MaxAltitude;
            if (dto.MaxGroupSize.HasValue) tour.MaxGroupSize = dto.MaxGroupSize;
            if (dto.IsFeatured.HasValue) tour.IsFeatured = dto.IsFeatured.Value;
            if (dto.IsActive.HasValue) tour.IsActive = dto.IsActive.Value;
            if (dto.SeoTitle != null) tour.SeoTitle = dto.SeoTitle;
            if (dto.SeoDescription != null) tour.SeoDescription = dto.SeoDescription;
            if (dto.VideoUrl != null) tour.VideoUrl = dto.VideoUrl;
            if (dto.Faqs != null) tour.Faqs = dto.Faqs;
            if (dto.KnowBeforeYouGo != null) tour.KnowBeforeYouGo = dto.KnowBeforeYouGo;

            tour.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return MapToDto(tour);
        }

        public async Task DeleteAsync(Guid tenantId, Guid id)
        {
            var tour = await _db.TourPackages
                .FirstOrDefaultAsync(t => t.TenantId == tenantId && t.Id == id)
                ?? throw new KeyNotFoundException("Tour not found");

            _db.TourPackages.Remove(tour);
            await _db.SaveChangesAsync();
        }

        private static TourPackageDto MapToDto(TourPackage t) => new()
        {
            Id = t.Id,
            TenantId = t.TenantId,
            CategoryId = t.CategoryId,
            CategoryName = t.Category?.Name,
            Title = t.Title,
            Slug = t.Slug,
            ShortDescription = t.ShortDescription,
            FullDescription = t.FullDescription,
            Highlights = t.Highlights,
            Itinerary = t.Itinerary,
            Inclusions = t.Inclusions,
            Exclusions = t.Exclusions,
            DurationDays = t.DurationDays,
            DurationNights = t.DurationNights,
            PriceUSD = t.PriceUSD,
            PriceINR = t.PriceINR,
            PriceEUR = t.PriceEUR,
            CoverImageUrl = t.CoverImageUrl,
            ImageUrls = t.ImageUrls,
            Difficulty = t.Difficulty.ToString(),
            MaxAltitude = t.MaxAltitude,
            MaxGroupSize = t.MaxGroupSize,
            Rating = t.Rating,
            ReviewCount = t.ReviewCount,
            IsFeatured = t.IsFeatured,
            IsActive = t.IsActive,
            SeoTitle = t.SeoTitle,
            SeoDescription = t.SeoDescription,
            VideoUrl = t.VideoUrl,
            Faqs = t.Faqs,
            KnowBeforeYouGo = t.KnowBeforeYouGo,
            CreatedAt = t.CreatedAt,
            UpdatedAt = t.UpdatedAt
        };
    }
}
