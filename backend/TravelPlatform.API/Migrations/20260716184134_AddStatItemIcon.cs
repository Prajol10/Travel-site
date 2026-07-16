using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelPlatform.API.Migrations
{
    /// <inheritdoc />
    public partial class AddStatItemIcon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IconName",
                table: "StatItems",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IconName",
                table: "StatItems");
        }
    }
}
