using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using System.Threading.Tasks;

namespace TrashInspection.Pn.Infrastructure.Models
{
    interface IModel
    {
        Task Save(TrashInspectionPnDbContext _dbcontext);

        Task Update(TrashInspectionPnDbContext _dbcontext);

        Task Delete(TrashInspectionPnDbContext _dbcontext);
    }
}
