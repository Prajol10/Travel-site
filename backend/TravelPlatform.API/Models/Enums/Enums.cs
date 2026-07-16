namespace TravelPlatform.API.Models.Enums
{
    public enum UserRole
    {
        SuperAdmin,
        TenantAdmin,
        Staff
    }

    public enum LeadStatus
    {
        New,
        Contacted,
        Qualified,
        Converted,
        Lost
    }

    public enum TourDifficultyLevel
    {
        Easy,
        Moderate,
        Challenging,
        Extreme
    }

    public enum ContentSectionType
    {
        Hero,
        AboutUs,
        WhyChooseUs,
        Testimonials,
        Gallery,
        Footer,
        Stats,
        FeaturedJourney,
        CTA,
        PrivacyPolicy,
        TermsOfService,
        BookingTerms,
        DocumentRequirements,
        PricingPolicy
    }

    public enum GalleryMediaType
    {
        Photo,
        Video
    }

    public enum BlogStatus
    {
        Draft,
        Published,
        Archived
    }

    public enum TenantStatus
    {
        Active,
        Suspended,
        Trial
    }
}
