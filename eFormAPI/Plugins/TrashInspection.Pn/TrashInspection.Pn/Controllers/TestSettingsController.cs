using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;

namespace TrashInspection.Pn.Controllers
{
    public class TestSettings
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class TestSettingsController : Controller
    {
        private readonly IPluginDbOptions<TestSettings> _options;
        private readonly TrashInspectionPnDbContext _dbContext;

        public TestSettingsController(IPluginDbOptions<TestSettings> options, TrashInspectionPnDbContext dbContext)
        {
            _options = options;
            _dbContext = dbContext;
        }

        [HttpGet]
        [Route("api/test-settings")]
        public TestSettings GetSettings()
        {
            return _options.Value;
        }

        [HttpPost]
        [Route("api/trash-inspection-pn")]
        public async Task<TestSettings> UpdateSettings([FromBody] TestSettings trashInspectionSettingsModel)
        {
            await _options.UpdateDb(
                x =>
                {
                    x.Id = trashInspectionSettingsModel.Id;
                    x.Name = trashInspectionSettingsModel.Name;
                },
                _dbContext, 1);
            return GetSettings();
        }
    }
}
