using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelPlatform.API.Migrations
{
    /// <inheritdoc />
    public partial class AddTourLocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "TourPackages",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "TourPackages");
        }
    }
}
