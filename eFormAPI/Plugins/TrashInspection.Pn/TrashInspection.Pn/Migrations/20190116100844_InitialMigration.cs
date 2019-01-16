using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TrashInspection.Pn.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Installations",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Created_at = table.Column<DateTime>(nullable: true),
                    Updated_at = table.Column<DateTime>(nullable: true),
                    Workflow_state = table.Column<string>(maxLength: 255, nullable: true),
                    Version = table.Column<int>(nullable: false),
                    Created_By_User_Id = table.Column<int>(nullable: false),
                    Updated_By_User_Id = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Installations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InstallationSites",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Created_at = table.Column<DateTime>(nullable: true),
                    Updated_at = table.Column<DateTime>(nullable: true),
                    Workflow_state = table.Column<string>(maxLength: 255, nullable: true),
                    Version = table.Column<int>(nullable: false),
                    Created_By_User_Id = table.Column<int>(nullable: false),
                    Updated_By_User_Id = table.Column<int>(nullable: false),
                    Installation_Id = table.Column<int>(nullable: false),
                    Sdk_Site_Id = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InstallationSites", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InstallationSiteVersions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Created_at = table.Column<DateTime>(nullable: true),
                    Updated_at = table.Column<DateTime>(nullable: true),
                    Workflow_state = table.Column<string>(maxLength: 255, nullable: true),
                    Version = table.Column<int>(nullable: false),
                    Created_By_User_Id = table.Column<int>(nullable: false),
                    Updated_By_User_Id = table.Column<int>(nullable: false),
                    Installation_Id = table.Column<int>(nullable: false),
                    Sdk_Site_Id = table.Column<int>(nullable: false),
                    Installation_Site_Id = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InstallationSiteVersions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InstallationVersions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Created_at = table.Column<DateTime>(nullable: true),
                    Updated_at = table.Column<DateTime>(nullable: true),
                    Workflow_state = table.Column<string>(maxLength: 255, nullable: true),
                    Version = table.Column<int>(nullable: false),
                    Created_By_User_Id = table.Column<int>(nullable: false),
                    Updated_By_User_Id = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    InstallationId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InstallationVersions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TrashInspectionPnSettings",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    SelectedeFormId = table.Column<int>(nullable: true),
                    SelectedeFormName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrashInspectionPnSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TrashInspections",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Created_at = table.Column<DateTime>(nullable: true),
                    Updated_at = table.Column<DateTime>(nullable: true),
                    Workflow_state = table.Column<string>(maxLength: 255, nullable: true),
                    Version = table.Column<int>(nullable: false),
                    Created_By_User_Id = table.Column<int>(nullable: false),
                    Updated_By_User_Id = table.Column<int>(nullable: false),
                    Weighing_Number = table.Column<int>(nullable: false),
                    Date = table.Column<DateTime>(nullable: false),
                    Time = table.Column<DateTime>(nullable: false),
                    Registration_Number = table.Column<string>(nullable: true),
                    Trash_Fraction = table.Column<int>(nullable: false),
                    Eak_Code = table.Column<int>(nullable: false),
                    Producer = table.Column<string>(nullable: true),
                    Transporter = table.Column<string>(nullable: true),
                    Installation_Id = table.Column<int>(nullable: false),
                    Must_Be_Inspected = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrashInspections", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TrashInspectionSettingsVersions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    SelectedeFormId = table.Column<int>(nullable: true),
                    SelectedeFormName = table.Column<string>(nullable: true),
                    Trash_Inspection_Id = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrashInspectionSettingsVersions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TrashInspectionVersions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Created_at = table.Column<DateTime>(nullable: true),
                    Updated_at = table.Column<DateTime>(nullable: true),
                    Workflow_state = table.Column<string>(maxLength: 255, nullable: true),
                    Version = table.Column<int>(nullable: false),
                    Created_By_User_Id = table.Column<int>(nullable: false),
                    Updated_By_User_Id = table.Column<int>(nullable: false),
                    Weighing_Number = table.Column<int>(nullable: false),
                    Date = table.Column<DateTime>(nullable: false),
                    Time = table.Column<DateTime>(nullable: false),
                    Registration_Number = table.Column<string>(nullable: true),
                    Trash_Fraction = table.Column<int>(nullable: false),
                    Eak_Code = table.Column<int>(nullable: false),
                    Producer = table.Column<string>(nullable: true),
                    Transporter = table.Column<string>(nullable: true),
                    Installation_Id = table.Column<int>(nullable: false),
                    Must_Be_Inspected = table.Column<bool>(nullable: false),
                    Trash_Inspction_Id = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrashInspectionVersions", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Installations");

            migrationBuilder.DropTable(
                name: "InstallationSites");

            migrationBuilder.DropTable(
                name: "InstallationSiteVersions");

            migrationBuilder.DropTable(
                name: "InstallationVersions");

            migrationBuilder.DropTable(
                name: "TrashInspectionPnSettings");

            migrationBuilder.DropTable(
                name: "TrashInspections");

            migrationBuilder.DropTable(
                name: "TrashInspectionSettingsVersions");

            migrationBuilder.DropTable(
                name: "TrashInspectionVersions");
        }
    }
}
