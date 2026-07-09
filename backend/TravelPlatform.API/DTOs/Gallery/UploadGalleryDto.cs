namespace TravelPlatform.API.DTOs.Gallery
{
    public class UploadGalleryDto
    {
        public string Url { get; set; } = string.Empty;
        public string? ThumbnailUrl { get; set; }
        public string? Caption { get; set; }
        public string MediaType { get; set; } = "Photo";
        public int SortOrder { get; set; } = 0;
    }
}
