using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;

namespace TrashInspection.Pn.Infrastructure.Models
{
    interface IModel
    {
        void Save(TrashInspectionPnDbContext _dbcontext);

        void Update(TrashInspectionPnDbContext _dbcontext);

        void Delete(TrashInspectionPnDbContext _dbcontext);
    }
}
