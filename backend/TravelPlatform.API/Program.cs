using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TravelPlatform.API.Data;
using TravelPlatform.API.Helpers;
using TravelPlatform.API.Middleware;
using TravelPlatform.API.Services;

var builder = WebApplication.CreateBuilder(args);

// ─── Database ───────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ─── Services ───────────────────────────────────────────────
builder.Services.AddScoped<JwtHelper>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<TenantService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<TourService>();
builder.Services.AddScoped<TourCategoryService>();
builder.Services.AddScoped<ContentService>();
builder.Services.AddScoped<BlogService>();
builder.Services.AddScoped<LeadService>();
builder.Services.AddScoped<GalleryService>();
builder.Services.AddScoped<TeamService>();
builder.Services.AddScoped<WhyChooseUsService>();
builder.Services.AddScoped<DestinationService>();
builder.Services.AddScoped<StatItemService>();
builder.Services.AddScoped<TestimonialService>();
builder.Services.AddHttpClient<SupabaseStorageService>();

// ─── JWT Authentication ─────────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// ─── CORS ───────────────────────────────────────────────────
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("TravelPlatformCors", policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .SetIsOriginAllowed(origin =>
            {
                if (origin.Contains("localhost")) return true;
                return allowedOrigins.Contains(origin, StringComparer.OrdinalIgnoreCase);
            });
    });
});

// ─── Controllers & JSON ─────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.MaxDepth = 64;
    });

// ─── Swagger ────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ─── Response Buffering (no size limit) ─────────────────────
builder.Services.AddResponseCompression();

// ─── Build ──────────────────────────────────────────────────
var app = builder.Build();

// ─── Apply Pending Migrations ─────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TravelPlatform.API.Data.AppDbContext>();
    db.Database.Migrate();
}

// ─── Middleware Pipeline ─────────────────────────────────────
app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseMiddleware<TenantResolutionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Travel Platform API v1");
        c.RoutePrefix = "swagger";
    });
}

// Render terminates TLS at the load balancer and forwards plain HTTP internally.
// Forcing HTTPS redirection here would create a redirect loop in that environment.
if (Environment.GetEnvironmentVariable("RENDER") != "true")
{
    app.UseHttpsRedirection();
}
app.UseCors("TravelPlatformCors");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ─── Auto Seed on Startup ────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    await Seeder.SeedAsync(db, config);
}

app.Run();
