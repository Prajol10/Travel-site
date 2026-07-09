using Microsoft.EntityFrameworkCore;
using TravelPlatform.API.Data;
using TravelPlatform.API.DTOs.Team;
using TravelPlatform.API.Models;

namespace TravelPlatform.API.Services
{
    public class TeamService
    {
        private readonly AppDbContext _db;

        public TeamService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<TeamMemberDto>> GetAllAsync(Guid tenantId)
        {
            return await _db.TeamMembers
                .Where(t => t.TenantId == tenantId && t.IsActive)
                .OrderBy(t => t.SortOrder)
                .Select(t => MapToDto(t))
                .ToListAsync();
        }

        public async Task<TeamMemberDto> CreateAsync(Guid tenantId, CreateTeamMemberDto dto)
        {
            var member = new TeamMember
            {
                TenantId = tenantId,
                FullName = dto.FullName,
                Role = dto.Role,
                Region = dto.Region,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                PhotoUrl = dto.PhotoUrl,
                SortOrder = dto.SortOrder
            };

            _db.TeamMembers.Add(member);
            await _db.SaveChangesAsync();

            return MapToDto(member);
        }

        public async Task DeleteAsync(Guid tenantId, Guid id)
        {
            var member = await _db.TeamMembers
                .FirstOrDefaultAsync(t => t.TenantId == tenantId && t.Id == id)
                ?? throw new KeyNotFoundException("Team member not found");

            _db.TeamMembers.Remove(member);
            await _db.SaveChangesAsync();
        }

        private static TeamMemberDto MapToDto(TeamMember t) => new()
        {
            Id = t.Id,
            FullName = t.FullName,
            Role = t.Role,
            Region = t.Region,
            PhoneNumber = t.PhoneNumber,
            Email = t.Email,
            PhotoUrl = t.PhotoUrl,
            SortOrder = t.SortOrder,
            IsActive = t.IsActive
        };
    }
}
