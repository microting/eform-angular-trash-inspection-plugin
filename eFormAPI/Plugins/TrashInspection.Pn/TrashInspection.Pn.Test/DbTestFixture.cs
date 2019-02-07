using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories.Factories;

namespace TrashInspection.Pn.Test
{
    [TestFixture]
    public abstract class DbTestFixture
    {

        protected TrashInspectionPnDbContext DbContext;
        protected string ConnectionString;


        private static string userName = "__USER_NAME__";
        private static string password = "__PASSWORD__";
        private static string databaseName = "__DBNAME__";
        private static string databaseServerId = "__DB_SERVER_ID__";
        private static string directoryId = "__DIRECTORY_ID__";
        private static string applicationId = "__APPLICATION_ID__";

        public void GetContext(string connectionStr)
        {
            TrashInspectionPnContextFactory contextFactory = new TrashInspectionPnContextFactory();
            DbContext = contextFactory.CreateDbContext(new[] {connectionStr});

            DbContext.Database.Migrate();
            DbContext.Database.EnsureCreated();
        }

        [SetUp]
        public void Setup()
        {
            //if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            //{
            //    ConnectionString = @"data source=(LocalDb)\SharedInstance;Initial catalog=trash-inspection-pn-tests;Integrated Security=true";
            //}
            //else
            //{
                ConnectionString = @"Server = localhost; port = 3306; Database = trash-inspection-pn-tests; user = root; Convert Zero Datetime = true;";
            //}

            GetContext(ConnectionString);


            DbContext.Database.SetCommandTimeout(300);

            try
            {
                ClearDb();
            }
            catch
            {
                DbContext.Database.Migrate();
            }
            DoSetup();
        }

        [TearDown]
        public void TearDown()
        {
            ClearDb();

            ClearFile();

            DbContext.Dispose();
        }

        public void ClearDb()
        {
            List<string> modelNames = new List<string>();
            modelNames.Add("TrashInspectionVersions");
            modelNames.Add("TrashInspections");
            modelNames.Add("TrashInspectionSettings");
            modelNames.Add("TrashInspectionSettingsVersions");
            modelNames.Add("Installations");
            modelNames.Add("InstallationVersions");
            modelNames.Add("InstallationSites");
            modelNames.Add("InstallationSiteVersions");
            modelNames.Add("FractionVersions");
            modelNames.Add("Fractions");
            modelNames.Add("SegmentVersions");
            modelNames.Add("Segments");




            foreach (var modelName in modelNames)
            {
                try
                {
                    string sqlCmd = string.Empty;
                    if (DbContext.Database.IsMySql())
                    {
                        sqlCmd = string.Format("SET FOREIGN_KEY_CHECKS = 0;TRUNCATE `{0}`.`{1}`", "trash-inspection-pn-tests", modelName);
                    }
                    else
                    {
                        sqlCmd = string.Format("DELETE FROM [{0}]", modelName);
                    }
                    DbContext.Database.ExecuteSqlCommand(sqlCmd);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
        }
        private string path;

        public void ClearFile()
        {
            path = System.Reflection.Assembly.GetExecutingAssembly().CodeBase;
            path = System.IO.Path.GetDirectoryName(path).Replace(@"file:\", "");

            string picturePath = path + @"\output\dataFolder\picture\Deleted";

            DirectoryInfo diPic = new DirectoryInfo(picturePath);

            try
            {
                foreach (FileInfo file in diPic.GetFiles())
                {
                    file.Delete();
                }
            }
            catch { }


        }
        public virtual void DoSetup() { }
    }
}
