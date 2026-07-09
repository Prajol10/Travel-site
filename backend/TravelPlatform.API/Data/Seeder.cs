using Microsoft.EntityFrameworkCore;
using TravelPlatform.API.Helpers;
using TravelPlatform.API.Models;
using TravelPlatform.API.Models.Enums;

namespace TravelPlatform.API.Data
{
    public static class Seeder
    {
        public static async Task SeedAsync(AppDbContext db, IConfiguration config)
        {
            // ─── SuperAdmin ──────────────────────────────────────
            var superAdminEmail = config["SuperAdmin:Email"]!;
            var superAdminExists = await db.Users
                .AnyAsync(u => u.Email == superAdminEmail);

            if (!superAdminExists)
            {
                var superAdmin = new User
                {
                    FullName = config["SuperAdmin:FullName"]!,
                    Email = superAdminEmail,
                    PasswordHash = PasswordHelper.Hash(config["SuperAdmin:Password"]!),
                    Role = UserRole.SuperAdmin,
                    TenantId = null
                };

                db.Users.Add(superAdmin);
                await db.SaveChangesAsync();
                Console.WriteLine("✅ SuperAdmin seeded");
            }

            // ─── Demo Tenant ─────────────────────────────────────
            var demoExists = await db.Tenants
                .AnyAsync(t => t.Subdomain == "demo");

            if (!demoExists)
            {
                var tenant = new Tenant
                {
                    Name = "Himalayan Journey Co.",
                    Subdomain = "demo",
                    PrimaryColor = "#C9A84C",
                    SecondaryColor = "#1B2B4B",
                    TagLine = "Your trusted Himalayan travel partner",
                    PhoneNumber = "+977-9841000000",
                    WhatsAppNumber = "+9779841000000",
                    Email = "info@himalayanjourney.com",
                    Address = "Thamel, Kathmandu, Nepal",
                    DefaultCurrency = "USD",
                    SupportedCurrencies = "USD,INR,EUR",
                    Status = TenantStatus.Active,
                    MetaTitle = "Himalayan Journey Co. - Premium Travel Agency",
                    MetaDescription = "Book your dream Himalayan adventure with us"
                };

                db.Tenants.Add(tenant);
                await db.SaveChangesAsync();

                // Demo admin user
                var adminUser = new User
                {
                    FullName = "Demo Admin",
                    Email = "admin@demo.com",
                    PasswordHash = PasswordHelper.Hash("Admin@123"),
                    Role = UserRole.TenantAdmin,
                    TenantId = tenant.Id
                };
                db.Users.Add(adminUser);

                // Stats
                db.StatItems.AddRange(
                    new StatItem { TenantId = tenant.Id, Value = "18+", Label = "Years Experience", SortOrder = 1 },
                    new StatItem { TenantId = tenant.Id, Value = "5000+", Label = "Happy Travelers", SortOrder = 2 },
                    new StatItem { TenantId = tenant.Id, Value = "50+", Label = "Destinations", SortOrder = 3 }
                );

                // Why Choose Us
                db.WhyChooseUsItems.AddRange(
                    new WhyChooseUsItem { TenantId = tenant.Id, Title = "Licensed & Insured", Description = "Fully certified by Nepal Tourism Board with comprehensive insurance coverage", IconName = "shield", SortOrder = 1 },
                    new WhyChooseUsItem { TenantId = tenant.Id, Title = "Expert Guides", Description = "Professional sherpa guides with decades of Himalayan experience", IconName = "users", SortOrder = 2 },
                    new WhyChooseUsItem { TenantId = tenant.Id, Title = "Personalized Service", Description = "Customized itineraries tailored to your preferences and needs", IconName = "heart", SortOrder = 3 },
                    new WhyChooseUsItem { TenantId = tenant.Id, Title = "24/7 Support", Description = "Round-the-clock assistance before, during, and after your journey", IconName = "headphones", SortOrder = 4 }
                );

                // Content Sections
                db.ContentSections.AddRange(
                    new ContentSection
                    {
                        TenantId = tenant.Id,
                        SectionType = ContentSectionType.Hero,
                        BadgeText = "SACRED HIMALAYAN JOURNEY!",
                        Title = "Your Sacred Himalayan Adventure Starts Here",
                        Subtitle = "Embark on a spiritual odyssey to the sacred mountains. Discover the mystical beauty of Nepal and Tibet.",
                        CtaText = "Explore Now",
                        CtaUrl = "/tours",
                        SecondaryCtaText = "Watch Video",
                        SecondaryCtaUrl = "#video",
                        IsActive = true
                    },
                    new ContentSection
                    {
                        TenantId = tenant.Id,
                        SectionType = ContentSectionType.AboutUs,
                        BadgeText = "ABOUT US",
                        Title = "Journey with Passion & Experience",
                        Body = "Since 2008, we have been guiding travelers to the sacred and breathtaking destinations of Nepal and Tibet. Backed by a team of knowledgeable guides and dedicated support staff, we are committed to providing safe, enriching, and memorable travel experiences.",
                        CtaText = "Learn More About Us",
                        CtaUrl = "/about",
                        IsActive = true
                    },
                    new ContentSection
                    {
                        TenantId = tenant.Id,
                        SectionType = ContentSectionType.WhyChooseUs,
                        BadgeText = "WHY CHOOSE US",
                        Title = "Your Trusted Travel Partner",
                        Subtitle = "Experience the difference with our professional team and exceptional service",
                        IsActive = true
                    },
                    new ContentSection
                    {
                        TenantId = tenant.Id,
                        SectionType = ContentSectionType.CTA,
                        Title = "Ready for Your Himalayan Adventure?",
                        Subtitle = "Let us craft the perfect journey for you. Contact our expert team today.",
                        CtaText = "Plan Your Journey",
                        CtaUrl = "/contact",
                        SecondaryCtaText = "Call Us Now",
                        IsActive = true
                    }
                );

                // Tour Category
                var category = new TourCategory
                {
                    TenantId = tenant.Id,
                    Name = "Overland Tours",
                    Slug = "overland-tours",
                    Description = "Classic overland routes through the Himalayas",
                    SortOrder = 1
                };
                db.TourCategories.Add(category);
                await db.SaveChangesAsync();

                // Sample Tour
                db.TourPackages.Add(new TourPackage
                {
                    TenantId = tenant.Id,
                    CategoryId = category.Id,
                    Title = "Himalayan Overland Tour 15 Days",
                    Slug = "himalayan-overland-tour-15-days",
                    ShortDescription = "A classic 15-day journey through the majestic Himalayas.",
                    DurationDays = 15,
                    DurationNights = 14,
                    PriceUSD = 3000,
                    PriceINR = 250000,
                    PriceEUR = 2800,
                    Difficulty = TourDifficultyLevel.Moderate,
                    IsFeatured = true,
                    IsActive = true,
                    Rating = 4.8,
                    ReviewCount = 120
                });

                await db.SaveChangesAsync();
                Console.WriteLine("✅ Demo tenant seeded");
            }
        }
    }
}
