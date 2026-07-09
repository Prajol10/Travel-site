using Microsoft.EntityFrameworkCore;
using TravelPlatform.API.Data;
using TravelPlatform.API.DTOs.User;
using TravelPlatform.API.Helpers;
using TravelPlatform.API.Models;
using TravelPlatform.API.Models.Enums;

namespace TravelPlatform.API.Services
{
    public class UserService
    {
        private readonly AppDbContext _db;

        public UserService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<UserDto>> GetByTenantAsync(Guid tenantId)
        {
            return await _db.Users
                .Where(u => u.TenantId == tenantId)
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => MapToDto(u))
                .ToListAsync();
        }

        public async Task<UserDto> CreateForTenantAsync(Guid tenantId, CreateTenantUserDto dto)
        {
            var tenantExists = await _db.Tenants.AnyAsync(t => t.Id == tenantId);
            if (!tenantExists)
                throw new KeyNotFoundException("Tenant not found");

            var emailTaken = await _db.Users.AnyAsync(u => u.Email == dto.Email);
            if (emailTaken)
                throw new ArgumentException("Email already in use");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = PasswordHelper.Hash(dto.Password),
                Role = UserRole.TenantAdmin,
                TenantId = tenantId,
                IsActive = true
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return MapToDto(user);
        }

        public async Task ResetPasswordAsync(Guid tenantId, Guid userId, string newPassword)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId && u.TenantId == tenantId)
                ?? throw new KeyNotFoundException("User not found");

            user.PasswordHash = PasswordHelper.Hash(newPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }

        public async Task SetStatusAsync(Guid tenantId, Guid userId, bool isActive)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId && u.TenantId == tenantId)
                ?? throw new KeyNotFoundException("User not found");

            user.IsActive = isActive;
            user.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }

        private static UserDto MapToDto(User u) => new()
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email,
            Role = u.Role.ToString(),
            TenantId = u.TenantId,
            IsActive = u.IsActive,
            CreatedAt = u.CreatedAt
        };
    }
}
