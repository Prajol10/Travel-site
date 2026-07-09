using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelPlatform.API.Migrations
{
    /// <inheritdoc />
    public partial class AddTourVideoFaqsKnowBefore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Faqs",
                table: "TourPackages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "KnowBeforeYouGo",
                table: "TourPackages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VideoUrl",
                table: "TourPackages",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Faqs",
                table: "TourPackages");

            migrationBuilder.DropColumn(
                name: "KnowBeforeYouGo",
                table: "TourPackages");

            migrationBuilder.DropColumn(
                name: "VideoUrl",
                table: "TourPackages");
        }
    }
}
