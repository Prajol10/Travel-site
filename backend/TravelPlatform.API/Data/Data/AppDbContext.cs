using Microsoft.EntityFrameworkCore;
using TravelPlatform.API.Models;
using TravelPlatform.API.Models.Enums;

namespace TravelPlatform.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Tenant> Tenants => Set<Tenant>();
        public DbSet<User> Users => Set<User>();
        public DbSet<TourCategory> TourCategories => Set<TourCategory>();
        public DbSet<TourPackage> TourPackages => Set<TourPackage>();
        public DbSet<ContentSection> ContentSections => Set<ContentSection>();
        public DbSet<WhyChooseUsItem> WhyChooseUsItems => Set<WhyChooseUsItem>();
        public DbSet<Destination> Destinations => Set<Destination>();
        public DbSet<StatItem> StatItems => Set<StatItem>();
        public DbSet<Testimonial> Testimonials => Set<Testimonial>();
        public DbSet<GalleryItem> GalleryItems => Set<GalleryItem>();
        public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
        public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
        public DbSet<Lead> Leads => Set<Lead>();
        public DbSet<NavigationItem> NavigationItems => Set<NavigationItem>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ---------- Tenant ----------
            modelBuilder.Entity<Tenant>(e =>
            {
                e.HasKey(t => t.Id);
                e.HasIndex(t => t.Subdomain).IsUnique();
                e.Property(t => t.Name).IsRequired().HasMaxLength(200);
                e.Property(t => t.Subdomain).IsRequired().HasMaxLength(100);
                e.Property(t => t.PrimaryColor).HasMaxLength(20);
                e.Property(t => t.SecondaryColor).HasMaxLength(20);
                e.Property(t => t.DefaultCurrency).HasMaxLength(10);
                e.Property(t => t.Status)
                    .HasConversion<string>();
            });

            // ---------- User ----------
            modelBuilder.Entity<User>(e =>
            {
                e.HasKey(u => u.Id);
                e.HasIndex(u => u.Email).IsUnique();
                e.Property(u => u.FullName).IsRequired().HasMaxLength(200);
                e.Property(u => u.Email).IsRequired().HasMaxLength(200);
                e.Property(u => u.Role).HasConversion<string>();
                e.HasOne(u => u.Tenant)
                    .WithMany(t => t.Users)
                    .HasForeignKey(u => u.TenantId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ---------- TourCategory ----------
            modelBuilder.Entity<TourCategory>(e =>
            {
                e.HasKey(c => c.Id);
                e.HasIndex(c => new { c.TenantId, c.Slug }).IsUnique();
                e.Property(c => c.Name).IsRequired().HasMaxLength(200);
                e.Property(c => c.Slug).IsRequired().HasMaxLength(200);
                e.HasOne(c => c.Tenant)
                    .WithMany(t => t.TourCategories)
                    .HasForeignKey(c => c.TenantId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ---------- TourPackage ----------
            modelBuilder.Entity<TourPackage>(e =>
            {
                e.HasKey(p => p.Id);
                e.HasIndex(p => new { p.TenantId, p.Slug }).IsUnique();
                e.Property(p => p.Title).IsRequired().HasMaxLength(300);
                e.Property(p => p.Slug).IsRequired().HasMaxLength(300);
                e.Property(p => p.PriceUSD).HasColumnType("decimal(18,2)");
                e.Property(p => p.PriceINR).HasColumnType("decimal(18,2)");
                e.Property(p => p.PriceEUR).HasColumnType("decimal(18,2)");
                e.Property(p => p.Difficulty).HasConversion<string>();
                e.HasOne(p => p.Tenant)
                    .WithMany(t => t.TourPackages)
                    .HasForeignKey(p => p.TenantId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(p => p.Category)
                    .WithMany(c => c.TourPackages)
                    .HasForeignKey(p => p.CategoryId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ---------- ContentSection ----------
            modelBuilder.Entity<ContentSection>(e =>
            {
                e.HasKey(c => c.Id);
                e.HasIndex(c => new { c.TenantId, c.SectionType }).IsUnique();
                e.Property(c => c.SectionType).HasConversion<string>();
                e.HasOne(c => c.Tenant)
                    .WithMany(t => t.ContentSections)
                    .HasForeignKey(c => c.TenantId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ---------- WhyChooseUsItem ----------
            modelBuilder.Entity<WhyChooseUsItem>(e =>
            {
                e.HasKey(w => w.Id);
                e.Property(w => w.Title).IsRequired().HasMaxLength(200);
                e.HasOne(w => w.Tenant)
                    .WithMany()
                    .HasForeignKey(w => w.TenantId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ---------- Destination ----------
            modelBuilder.Entity<Destination>(e =>
            {
                e.HasKey(d => d.Id);
                e.Property(d => d.Name).IsRequired().HasMaxLength(200);
                e.HasOne(d => d.Tenant)
                    .WithMany()
                    .HasForeignKey(d => d.TenantId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ---------- StatItem ----------
            modelBuilder.Entity<StatItem>(e =>
            {
                e.HasKey(s => s.Id);
                e.Property(s => s.Value).IsRequired().HasMaxLength(50);
                e.Property(s => s.Label).IsRequired().HasMaxLength(100);
                e.HasOne(s => s.Tenant)
                    .WithMany()
                    .HasForeignKey(s => s.TenantId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ---------- Testimonial ----------
            modelBuilder.Entity<Testimonial>(e =>
            {
                e.HasKey(t => t.Id);
                e.Property(t => t.AuthorName).IsRequired().HasMaxLength(200);
                e.Property(t => t.ReviewText).IsRequired();
                e.HasOne(t => t.Tenant)
                    .WithMany(t => t.Testimonials)
                    .HasForeignKey(t => t.TenantId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ---------- GalleryItem ----------
            modelBuilder.Entity<GalleryItem>(e =>
            {
                e.HasKey(g => g.Id);
                e.Property(g => g.Url).IsRequired();
                e.Property(g => g.MediaType).HasConversion<string>();
                e.HasOne(g => g.Tenant)
                    .WithMany(t => t.GalleryItems)
                    .HasForeignKey(g => g.TenantId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ---------- BlogPost ----------
            modelBuilder.Entity<BlogPost>(e =>
            {
                e.HasKey(b => b.Id);
                e.HasIndex(b => new { b.TenantId, b.Slug }).IsUnique();
                e.Property(b => b.Title).IsRequired().HasMaxLength(300);
                e.Property(b => b.Slug).IsRequired().HasMaxLength(300);
                e.Property(b => b.Status).HasConversion<string>();
                e.HasOne(b => b.Tenant)
                    .WithMany(t => t.BlogPosts)
                    .HasForeignKey(b => b.TenantId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ---------- TeamMember ----------
            modelBuilder.Entity<TeamMember>(e =>
            {
                e.HasKey(t => t.Id);
                e.Property(t => t.FullName).IsRequired().HasMaxLength(200);
                e.HasOne(t => t.Tenant)
                    .WithMany(t => t.TeamMembers)
                    .HasForeignKey(t => t.TenantId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ---------- Lead ----------
            modelBuilder.Entity<Lead>(e =>
            {
                e.HasKey(l => l.Id);
                e.Property(l => l.FullName).IsRequired().HasMaxLength(200);
                e.Property(l => l.Status).HasConversion<string>();
                e.HasOne(l => l.Tenant)
                    .WithMany(t => t.Leads)
                    .HasForeignKey(l => l.TenantId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ---------- NavigationItem ----------
            modelBuilder.Entity<NavigationItem>(e =>
            {
                e.HasKey(n => n.Id);
                e.Property(n => n.Label).IsRequired().HasMaxLength(200);
                e.HasOne(n => n.Tenant)
                    .WithMany(t => t.NavigationItems)
                    .HasForeignKey(n => n.TenantId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(n => n.Parent)
                    .WithMany(n => n.Children)
                    .HasForeignKey(n => n.ParentId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
