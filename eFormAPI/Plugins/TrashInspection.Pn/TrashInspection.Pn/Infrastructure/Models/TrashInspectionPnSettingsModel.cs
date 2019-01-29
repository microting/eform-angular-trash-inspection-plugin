using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class TrashInspectionPnSettingsModel : IModel
    {
        public int? SelectedeFormId { get; set; }
        public string SelectedeFormName { get; set; }
        public string Token { get; set; }
        
        public void Save(TrashInspectionPnDbContext _dbcontext)
        {
            throw new System.NotImplementedException();
        }

        public void Update(TrashInspectionPnDbContext _dbcontext)
        {
            throw new System.NotImplementedException();
        }

        public void Delete(TrashInspectionPnDbContext _dbcontext)
        {
            throw new System.NotImplementedException();
        }
    }
}
