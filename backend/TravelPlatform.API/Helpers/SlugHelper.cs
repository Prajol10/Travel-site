using System.Text;
using System.Text.RegularExpressions;

namespace TravelPlatform.API.Helpers
{
    public static class SlugHelper
    {
        public static string Generate(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return string.Empty;

            var slug = input.ToLowerInvariant().Trim();

            // Replace spaces and special chars with hyphens
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
            slug = Regex.Replace(slug, @"\s+", "-");
            slug = Regex.Replace(slug, @"-+", "-");
            slug = slug.Trim('-');

            return slug;
        }

        public static string GenerateUnique(string input, IEnumerable<string> existingSlugs)
        {
            var baseSlug = Generate(input);
            var slug = baseSlug;
            var counter = 1;

            while (existingSlugs.Contains(slug))
            {
                slug = $"{baseSlug}-{counter}";
                counter++;
            }

            return slug;
        }
    }
}
