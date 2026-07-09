using Microsoft.EntityFrameworkCore;
using TravelPlatform.API.Data;
using TravelPlatform.API.DTOs.Blog;
using TravelPlatform.API.Helpers;
using TravelPlatform.API.Models;
using TravelPlatform.API.Models.Enums;

namespace TravelPlatform.API.Services
{
    public class BlogService
    {
        private readonly AppDbContext _db;

        public BlogService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<BlogPostDto>> GetAllAsync(Guid tenantId, bool publishedOnly = true)
        {
            var query = _db.BlogPosts.Where(b => b.TenantId == tenantId);
            if (publishedOnly) query = query.Where(b => b.Status == BlogStatus.Published);

            return await query
                .OrderByDescending(b => b.PublishedAt)
                .Select(b => MapToDto(b))
                .ToListAsync();
        }

        public async Task<BlogPostDto> GetBySlugAsync(Guid tenantId, string slug)
        {
            var post = await _db.BlogPosts
                .FirstOrDefaultAsync(b => b.TenantId == tenantId && b.Slug == slug)
                ?? throw new KeyNotFoundException("Blog post not found");
            return MapToDto(post);
        }

        public async Task<BlogPostDto> CreateAsync(Guid tenantId, CreateBlogDto dto)
        {
            var existingSlugs = await _db.BlogPosts
                .Where(b => b.TenantId == tenantId)
                .Select(b => b.Slug)
                .ToListAsync();

            var slug = SlugHelper.GenerateUnique(dto.Title, existingSlugs);

            var post = new BlogPost
            {
                TenantId = tenantId,
                Title = dto.Title,
                Slug = slug,
                Excerpt = dto.Excerpt,
                Body = dto.Body,
                CoverImageUrl = dto.CoverImageUrl,
                Category = dto.Category,
                Status = dto.PublishNow ? BlogStatus.Published : BlogStatus.Draft,
                PublishedAt = dto.PublishNow ? DateTime.UtcNow : null,
                SeoTitle = dto.SeoTitle,
                SeoDescription = dto.SeoDescription
            };

            _db.BlogPosts.Add(post);
            await _db.SaveChangesAsync();

            return MapToDto(post);
        }

        public async Task<BlogPostDto> PublishAsync(Guid tenantId, Guid id)
        {
            var post = await _db.BlogPosts
                .FirstOrDefaultAsync(b => b.TenantId == tenantId && b.Id == id)
                ?? throw new KeyNotFoundException("Blog post not found");

            post.Status = BlogStatus.Published;
            post.PublishedAt = DateTime.UtcNow;
            post.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return MapToDto(post);
        }

        public async Task DeleteAsync(Guid tenantId, Guid id)
        {
            var post = await _db.BlogPosts
                .FirstOrDefaultAsync(b => b.TenantId == tenantId && b.Id == id)
                ?? throw new KeyNotFoundException("Blog post not found");

            _db.BlogPosts.Remove(post);
            await _db.SaveChangesAsync();
        }

        private static BlogPostDto MapToDto(BlogPost b) => new()
        {
            Id = b.Id,
            Title = b.Title,
            Slug = b.Slug,
            Excerpt = b.Excerpt,
            Body = b.Body,
            CoverImageUrl = b.CoverImageUrl,
            Category = b.Category,
            Status = b.Status.ToString(),
            SeoTitle = b.SeoTitle,
            SeoDescription = b.SeoDescription,
            PublishedAt = b.PublishedAt,
            CreatedAt = b.CreatedAt,
            UpdatedAt = b.UpdatedAt
        };
    }
}
