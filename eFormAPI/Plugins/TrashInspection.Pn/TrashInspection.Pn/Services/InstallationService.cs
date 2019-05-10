using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using eFormShared;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Extensions;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using OpenStack.NetCoreSwiftClient.Extensions;

namespace TrashInspection.Pn.Services
{
    public class InstallationService : IInstallationService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly TrashInspectionPnDbContext _dbContext;
        private readonly ITrashInspectionLocalizationService _trashInspectionLocalizationService;

        public InstallationService(TrashInspectionPnDbContext dbContext,
            IEFormCoreService coreHelper,
            ITrashInspectionLocalizationService trashInspectionLocalizationService)
        {
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

                if (!pnRequestModel.NameFilter.IsNullOrEmpty() && pnRequestModel.NameFilter != "")
                {
                    installationsQuery = installationsQuery.Where(x => x.Name.Contains(pnRequestModel.NameFilter));
                }
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

                installationsQuery
                    = installationsQuery
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Skip(pnRequestModel.Offset)
                        .Take(pnRequestModel.PageSize);
                
                List<InstallationModel> installations = await installationsQuery.Select(x => new InstallationModel()
                {
                    Id = x.Id,
                    Name = x.Name
                }).ToListAsync();

                installationsModel.Total = _dbContext.Installations.Count(x => x.WorkflowState != Constants.WorkflowStates.Removed);
                installationsModel.InstallationList = installations;
                
                
                return new OperationDataResult<InstallationsModel>(true, installationsModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<InstallationsModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingInstallations"));

            }
        }

        public async Task<OperationDataResult<InstallationModel>> GetSingleInstallation(int id)
        {
            try
            {
                Installation installation = await _dbContext.Installations.FirstOrDefaultAsync(x => x.Id == id);

                if (installation == null)
                {
                    return new OperationDataResult<InstallationModel>(false,
                        _trashInspectionLocalizationService.GetString($"InstallationWithID:{id}DoesNotExist"));
                }

                List<InstallationSite> installationSites = _dbContext.InstallationSites
                    .Where(x => x.InstallationId == installation.Id && x.WorkflowState != Constants.WorkflowStates.Removed).ToList();
                
                InstallationModel installationModel = new InstallationModel();
                installationModel.Name = installation.Name;
                installationModel.Id = installation.Id;
                installationModel.DeployCheckboxes = new List<DeployCheckbox>();
                
                foreach (InstallationSite installationSite in installationSites)
                {
                    DeployCheckbox deployCheckbox = new DeployCheckbox();
                    deployCheckbox.Id = installationSite.SDKSiteId;
                    deployCheckbox.IsChecked = true;
                    installationModel.DeployCheckboxes.Add(deployCheckbox);
                }

                return new OperationDataResult<InstallationModel>(true, installationModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
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

                        await installationSiteModel.Save(_dbContext);

                    }
                }
                

            }
            return new OperationResult(true);

        }

        public async Task<OperationResult> UpdateInstallation(InstallationModel updateModel)
        {
            updateModel.Update(_dbContext);

            List<InstallationSite> installationSites = _dbContext.InstallationSites.Where(x => x.InstallationId == updateModel.Id).ToList();
            List<InstallationSite> toBeRemovedInstallationSites = installationSites;

            foreach (DeployCheckbox deployedCheckbox in updateModel.DeployCheckboxes)
            {
                if (installationSites.SingleOrDefault(x => x.SDKSiteId == deployedCheckbox.Id) == null)
                {
                    InstallationSiteModel installationSiteModel = new InstallationSiteModel();
                    installationSiteModel.SdkSiteId = deployedCheckbox.Id;
                    installationSiteModel.InstallationId = updateModel.Id;

                    await installationSiteModel.Save(_dbContext);
                }
                else
                {
                    // Site already there, so pop from list of sites to be removed
                    InstallationSite installationSite =
                        toBeRemovedInstallationSites.SingleOrDefault(x => x.SDKSiteId == deployedCheckbox.Id);
                    if (installationSite.WorkflowState == Constants.WorkflowStates.Removed)
                    {
                        InstallationSiteModel installationSiteModel = new InstallationSiteModel();
                        installationSiteModel.Id = installationSite.Id;
                        installationSiteModel.SdkSiteId = deployedCheckbox.Id;
                        installationSiteModel.InstallationId = updateModel.Id;
                        installationSiteModel.WorkflowState = Constants.WorkflowStates.Created;
                        await installationSiteModel.Update(_dbContext);

                    } 
                    toBeRemovedInstallationSites.Remove(installationSite);
                }
            }

            foreach (InstallationSite installationSite in toBeRemovedInstallationSites)
            {
                InstallationSiteModel installationSiteModel = new InstallationSiteModel();
                installationSiteModel.Id = installationSite.Id;
                await installationSiteModel.Delete(_dbContext);
            }
            return new OperationResult(true);
        }

        public async Task<OperationResult> DeleteInstallation(int id)
        {
            InstallationModel installation = new InstallationModel();
            installation.Id = id;
            await installation.Delete(_dbContext);
            return new OperationResult(true);

        }
    }
}
