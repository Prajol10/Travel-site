using Microsoft.EntityFrameworkCore;
using TravelPlatform.API.Data;
using TravelPlatform.API.DTOs.Auth;
using TravelPlatform.API.Helpers;
using TravelPlatform.API.Models;
using TravelPlatform.API.Models.Enums;

namespace TravelPlatform.API.Services
{
    public class AuthService
    {
        private readonly AppDbContext _db;
        private readonly JwtHelper _jwt;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext db, JwtHelper jwt, IConfiguration config)
        {
            _db = db;
            _jwt = jwt;
            _config = config;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _db.Users
                .Include(u => u.Tenant)
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);

            if (user == null || !PasswordHelper.Verify(request.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid email or password");

            var token = _jwt.GenerateToken(user);

            return new AuthResponse
            {
                Token = token,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.ToString(),
                TenantId = user.TenantId,
                ExpiresAt = DateTime.UtcNow.AddHours(
                    double.Parse(_config["Jwt:ExpiryHours"]!))
            };
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request, UserRole role = UserRole.TenantAdmin)
        {
            var exists = await _db.Users.AnyAsync(u => u.Email == request.Email);
            if (exists)
                throw new ArgumentException("Email already in use");

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = PasswordHelper.Hash(request.Password),
                Role = role,
                TenantId = request.TenantId
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var token = _jwt.GenerateToken(user);

            return new AuthResponse
            {
                Token = token,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.ToString(),
                TenantId = user.TenantId,
                ExpiresAt = DateTime.UtcNow.AddHours(
                    double.Parse(_config["Jwt:ExpiryHours"]!))
            };
        }
    }
}
