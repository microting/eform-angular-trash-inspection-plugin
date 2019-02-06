using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Extensions;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;

namespace TrashInspection.Pn.Services
{
    public class InstallationService : IInstallationService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILogger<InstallationService> _logger;
        private readonly TrashInspectionPnDbContext _dbContext;
        private readonly ITrashInspectionLocalizationService _trashInspectionLocalizationService;

        public InstallationService(ILogger<InstallationService> logger,
            TrashInspectionPnDbContext dbContext,
            IEFormCoreService coreHelper,
            ITrashInspectionLocalizationService trashInspectionLocalizationService)
        {
            _logger = logger;
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _trashInspectionLocalizationService = trashInspectionLocalizationService;
        }

        public async Task<OperationDataResult<InstallationsModel>> GetAllInstallations(InstallationRequestModel pnRequestModel)
        {
            try
            {
                InstallationsModel installationsModel = new InstallationsModel();
                
                IQueryable<Installation> installationsQuery = _dbContext.Installations.AsQueryable();
                if (!string.IsNullOrEmpty(pnRequestModel.Sort))
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        installationsQuery = installationsQuery
                            .CustomOrderByDescending(pnRequestModel.Sort);
                    }
                    else
                    {
                        installationsQuery = installationsQuery
                            .CustomOrderBy(pnRequestModel.Sort);
                    }
                }
                else
                {
                    installationsQuery = _dbContext.Installations
                        .OrderBy(x => x.Id);
                }

                if (pnRequestModel.PageSize != null)
                {
                    installationsQuery = installationsQuery
                        .Skip(pnRequestModel.Offset)
                        .Take((int)pnRequestModel.PageSize);
                }

                installationsQuery = installationsQuery.Where(x => x.WorkflowState != eFormShared.Constants.WorkflowStates.Removed);

                List<InstallationModel> installations = await installationsQuery.Select(x => new InstallationModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                }).ToListAsync();

                installationsModel.Total = await _dbContext.Installations.CountAsync();
                installationsModel.InstallationList = installations;
                
                
                return new OperationDataResult<InstallationsModel>(true, installationsModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<InstallationsModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingInstallations"));

            }
        }

        public async Task<OperationDataResult<InstallationModel>> GetSingleInstallation(int id)
        {
            try
            {
                var installation = await _dbContext.Installations.Select(x => new InstallationModel()
                {
                    Id = x.Id,
                    Name = x.Name
                })
                .FirstOrDefaultAsync(x => x.Id == id);

                if (installation == null)
                {
                    return new OperationDataResult<InstallationModel>(false,
                        _trashInspectionLocalizationService.GetString($"InstallationWithID:{id}DoesNotExist"));
                }

                return new OperationDataResult<InstallationModel>(true, installation);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<InstallationModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingInstallation"));
            }
        }

        public async Task<OperationResult> CreateInstallation(InstallationModel createModel)
        {
            createModel.Save(_dbContext);
            foreach (DeployCheckbox deployedCheckbox in createModel.DeployCheckboxes)
            {
                InstallationSite installationSite = _dbContext.InstallationSites.FirstOrDefault(x => x.Id == deployedCheckbox.Id);
                if(installationSite == null)
                {
                    if (deployedCheckbox.IsChecked == true)
                    {
                        InstallationSiteModel installationSiteModel = new InstallationSiteModel();
                        installationSiteModel.SdkSiteId = deployedCheckbox.Id;
                        installationSiteModel.InstallationId = createModel.Id;

                        installationSiteModel.Save(_dbContext);

                    }
                }
                

            }
            return new OperationResult(true);

        }

        public async Task<OperationResult> UpdateInstallation(InstallationModel updateModel)
        {
            InstallationModel installation = new InstallationModel();
            installation.Id = updateModel.Id;
            updateModel.Update(_dbContext);
            foreach (DeployCheckbox deployedCheckbox in updateModel.DeployCheckboxes)
            {
                InstallationSite installationSite = _dbContext.InstallationSites.FirstOrDefault(x => x.Id == deployedCheckbox.Id);
                if (installationSite == null)
                {
                    if (deployedCheckbox.IsChecked == true)
                    {
                        InstallationSiteModel installationSiteModel = new InstallationSiteModel();
                        installationSiteModel.SdkSiteId = deployedCheckbox.Id;
                        installationSiteModel.InstallationId = updateModel.Id;

                        installationSiteModel.Save(_dbContext);

                    }
                }


            }
            return new OperationResult(true);
        }

        public async Task<OperationResult> DeleteInstallation(int id)
        {
            InstallationModel installation = new InstallationModel();
            installation.Id = id;
            installation.Delete(_dbContext);
            return new OperationResult(true);

        }
    }
}
