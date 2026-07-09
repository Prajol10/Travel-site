using Microsoft.EntityFrameworkCore;
using TravelPlatform.API.Data;
using TravelPlatform.API.DTOs.Lead;
using TravelPlatform.API.Models;
using TravelPlatform.API.Models.Enums;

namespace TravelPlatform.API.Services
{
    public class LeadService
    {
        private readonly AppDbContext _db;

        public LeadService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<LeadDto>> GetAllAsync(Guid tenantId, string? status = null)
        {
            var query = _db.Leads.Where(l => l.TenantId == tenantId);

            if (!string.IsNullOrEmpty(status) &&
                Enum.TryParse<LeadStatus>(status, true, out var leadStatus))
                query = query.Where(l => l.Status == leadStatus);

            return await query
                .OrderByDescending(l => l.CreatedAt)
                .Select(l => MapToDto(l))
                .ToListAsync();
        }

        public async Task<LeadDto> CreateAsync(Guid tenantId, CreateLeadDto dto)
        {
            var lead = new Lead
            {
                TenantId = tenantId,
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                CountryCode = dto.CountryCode,
                Message = dto.Message,
                TourInterest = dto.TourInterest,
                Source = dto.Source ?? "contact_form",
                Status = LeadStatus.New
            };

            _db.Leads.Add(lead);
            await _db.SaveChangesAsync();

            return MapToDto(lead);
        }

        public async Task<LeadDto> UpdateStatusAsync(Guid tenantId, Guid id, UpdateLeadStatusDto dto)
        {
            var lead = await _db.Leads
                .FirstOrDefaultAsync(l => l.TenantId == tenantId && l.Id == id)
                ?? throw new KeyNotFoundException("Lead not found");

            if (Enum.TryParse<LeadStatus>(dto.Status, true, out var status))
                lead.Status = status;

            if (dto.Notes != null) lead.Notes = dto.Notes;
            lead.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return MapToDto(lead);
        }

        public async Task DeleteAsync(Guid tenantId, Guid id)
        {
            var lead = await _db.Leads
                .FirstOrDefaultAsync(l => l.TenantId == tenantId && l.Id == id)
                ?? throw new KeyNotFoundException("Lead not found");

            _db.Leads.Remove(lead);
            await _db.SaveChangesAsync();
        }

        private static LeadDto MapToDto(Lead l) => new()
        {
            Id = l.Id,
            FullName = l.FullName,
            PhoneNumber = l.PhoneNumber,
            Email = l.Email,
            CountryCode = l.CountryCode,
            Message = l.Message,
            TourInterest = l.TourInterest,
            Status = l.Status.ToString(),
            Notes = l.Notes,
            Source = l.Source,
            CreatedAt = l.CreatedAt,
            UpdatedAt = l.UpdatedAt
        };
    }
}
