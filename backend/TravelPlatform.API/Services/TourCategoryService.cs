using Microsoft.EntityFrameworkCore;
using TravelPlatform.API.Data;
using TravelPlatform.API.DTOs.TourCategory;
using TravelPlatform.API.Helpers;
using TravelPlatform.API.Models;

namespace TravelPlatform.API.Services
{
    public class TourCategoryService
    {
        private readonly AppDbContext _db;

        public TourCategoryService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<TourCategoryDto>> GetAllAsync(Guid tenantId, bool activeOnly = false)
        {
            var query = _db.TourCategories
                .Include(c => c.TourPackages)
                .Where(c => c.TenantId == tenantId);

            if (activeOnly) query = query.Where(c => c.IsActive);

            return await query
                .OrderBy(c => c.SortOrder)
                .Select(c => new TourCategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Slug = c.Slug,
                    Description = c.Description,
                    IconUrl = c.IconUrl,
                    SortOrder = c.SortOrder,
                    IsActive = c.IsActive,
                    TourCount = c.TourPackages.Count,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<TourCategoryDto> CreateAsync(Guid tenantId, CreateTourCategoryDto dto)
        {
            var existingSlugs = await _db.TourCategories
                .Where(c => c.TenantId == tenantId)
                .Select(c => c.Slug)
                .ToListAsync();

            var slug = SlugHelper.GenerateUnique(dto.Name, existingSlugs);

            var category = new TourCategory
            {
                TenantId = tenantId,
                Name = dto.Name,
                Slug = slug,
                Description = dto.Description,
                IconUrl = dto.IconUrl,
                SortOrder = dto.SortOrder
            };

            _db.TourCategories.Add(category);
            await _db.SaveChangesAsync();

            return new TourCategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                Description = category.Description,
                IconUrl = category.IconUrl,
                SortOrder = category.SortOrder,
                IsActive = category.IsActive,
                TourCount = 0,
                CreatedAt = category.CreatedAt
            };
        }

        public async Task<TourCategoryDto> UpdateAsync(Guid tenantId, Guid id, UpdateTourCategoryDto dto)
        {
            var category = await _db.TourCategories
                .Include(c => c.TourPackages)
                .FirstOrDefaultAsync(c => c.TenantId == tenantId && c.Id == id)
                ?? throw new KeyNotFoundException("Category not found");

            if (dto.Name != null) category.Name = dto.Name;
            if (dto.Description != null) category.Description = dto.Description;
            if (dto.IconUrl != null) category.IconUrl = dto.IconUrl;
            if (dto.SortOrder.HasValue) category.SortOrder = dto.SortOrder.Value;
            if (dto.IsActive.HasValue) category.IsActive = dto.IsActive.Value;

            await _db.SaveChangesAsync();

            return new TourCategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                Description = category.Description,
                IconUrl = category.IconUrl,
                SortOrder = category.SortOrder,
                IsActive = category.IsActive,
                TourCount = category.TourPackages.Count,
                CreatedAt = category.CreatedAt
            };
        }

        public async Task DeleteAsync(Guid tenantId, Guid id)
        {
            var category = await _db.TourCategories
                .FirstOrDefaultAsync(c => c.TenantId == tenantId && c.Id == id)
                ?? throw new KeyNotFoundException("Category not found");

            _db.TourCategories.Remove(category);
            await _db.SaveChangesAsync();
        }
    }
}
