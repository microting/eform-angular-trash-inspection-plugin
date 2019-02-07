using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class TrashInspectionPnSettingsModel : IModel
    {
        public List<TrashInspectionPnSettingModel> trashInspectionSettingsList { get; set; }
        
        public Task Save(TrashInspectionPnDbContext _dbcontext)
        {
            throw new System.NotImplementedException();
        }

        public Task Update(TrashInspectionPnDbContext _dbcontext)
        {
            throw new System.NotImplementedException();
        }

        public Task Delete(TrashInspectionPnDbContext _dbcontext)
        {
            throw new System.NotImplementedException();
        }
        
        public static bool SettingCreateDefaults(TrashInspectionPnDbContext _dbcontext)
        {
            SettingCreate(_dbcontext, Settings.SdkConnectionString);
            SettingCreate(_dbcontext, Settings.LogLevel);
            SettingCreate(_dbcontext, Settings.LogLimit);
            SettingCreate(_dbcontext, Settings.MaxParallelism);
            SettingCreate(_dbcontext, Settings.NumberOfWorkers);
            SettingCreate(_dbcontext, Settings.Token);
            SettingCreate(_dbcontext, Settings.CallBackUrl);

            return true;
        }
        
        public static void SettingCreate(TrashInspectionPnDbContext _dbcontext, Settings name)
        {
            #region id = settings.name
            int id = -1;
            string defaultValue = "default";
            switch (name)
            {
                case Settings.SdkConnectionString: defaultValue = "..."; break;
                case Settings.LogLevel: defaultValue = "4"; break;
                case Settings.LogLimit: defaultValue = "25000"; break;
                case Settings.MaxParallelism: defaultValue = "1"; break;
                case Settings.NumberOfWorkers: defaultValue = "1"; break;
                case Settings.Token: defaultValue = "..."; break;
                case Settings.CallBackUrl: defaultValue = "..."; break;
                
                default:
                    throw new IndexOutOfRangeException(name.ToString() + " is not a known/mapped Settings type");
            }
            #endregion

            if (_dbcontext.TrashInspectionPnSettings.Count(x => x.Name == name.ToString()) < 1)
            {
                TrashInspectionPnSettingModel trashInspectionPnSettingModel = new TrashInspectionPnSettingModel();
                trashInspectionPnSettingModel.Name = name.ToString();
                trashInspectionPnSettingModel.Value = defaultValue;
                trashInspectionPnSettingModel.Save(_dbcontext);                
            }
        }      
        

        public string SettingRead(TrashInspectionPnDbContext _dbcontext, Settings name)
        {
//            try
//            {
                TrashInspectionPnSetting match = _dbcontext.TrashInspectionPnSettings.Single(x => x.Name == name.ToString());

                if (match.Value == null)
                    return "";

                return match.Value;
//            }
//            catch (Exception ex)
//            {
////                throw new Exception(t.GetMethodName("SQLController") + " failed", ex);
//            }
        }
        
        public List<string> SettingCheckAll(TrashInspectionPnDbContext _dbcontext)
        {
            List<string> result = new List<string>();
//            try
//            {

                int countVal = _dbcontext.TrashInspectionPnSettings.Count(x => x.Value == "");
                int countSet = _dbcontext.TrashInspectionPnSettings.Count();

                if (countSet == 0)
                {
                    result.Add("NO SETTINGS PRESENT, NEEDS PRIMING!");
                    return result;
                }

                foreach (var setting in Enum.GetValues(typeof(Settings)))
                {
                    try
                    {
                        string readSetting = SettingRead(_dbcontext, (Settings)setting);
                        if (string.IsNullOrEmpty(readSetting))
                            result.Add(setting.ToString() + " has an empty value!");
                    }
                    catch
                    {
                        result.Add("There is no setting for " + setting + "! You need to add one");
                    }
                }
                return result;
//            }
//            catch (Exception ex)
//            {
////                throw new Exception(t.GetMethodName("SQLController") + " failed", ex);
//            }
        }
        
        public enum Settings
        {
            LogLevel,
            LogLimit,
            SdkConnectionString,
            MaxParallelism,
            NumberOfWorkers,
            Token,
            CallBackUrl
        }
    }
}
