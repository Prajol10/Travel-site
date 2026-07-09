using System.Net.Http.Headers;

namespace TravelPlatform.API.Services
{
    public class SupabaseStorageService
    {
        private readonly HttpClient _http;
        private readonly string _supabaseUrl;
        private readonly string _serviceRoleKey;
        private readonly string _bucket;

        public SupabaseStorageService(HttpClient http, IConfiguration config)
        {
            _http = http;
            _supabaseUrl = config["Supabase:Url"]!.TrimEnd('/');
            _serviceRoleKey = config["Supabase:ServiceRoleKey"]!;
            _bucket = config["Supabase:StorageBucket"]!;
        }

        public async Task<string> UploadAsync(IFormFile file, string folder)
        {
            if (file.Length == 0)
                throw new ArgumentException("Empty file");

            var ext = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{ext}";
            var path = $"{folder.Trim('/')}/{fileName}";

            using var stream = file.OpenReadStream();
            using var content = new StreamContent(stream);
            content.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType ?? "application/octet-stream");

            var url = $"{_supabaseUrl}/storage/v1/object/{_bucket}/{path}";
            using var request = new HttpRequestMessage(HttpMethod.Post, url) { Content = content };
            request.Headers.Add("Authorization", $"Bearer {_serviceRoleKey}");
            request.Headers.Add("apikey", _serviceRoleKey);
            request.Headers.Add("x-upsert", "false");

            var response = await _http.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Supabase upload failed: {response.StatusCode} - {error}");
            }

            return $"{_supabaseUrl}/storage/v1/object/public/{_bucket}/{path}";
        }
    }
}
