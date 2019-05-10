/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 microting

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using eFormShared;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
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
            Installation installation = new Installation
            {
                Name = createModel.Name
            };
            installation.Create(_dbContext);
            
            foreach (DeployCheckbox deployedCheckbox in createModel.DeployCheckboxes)
            {
                if (deployedCheckbox.IsChecked == true)
                {
                    InstallationSite installationSite = new InstallationSite
                    {
                        InstallationId = installation.Id,
                        SDKSiteId = deployedCheckbox.Id
                    };
                    installation.Create(_dbContext);
                }
            }
            return new OperationResult(true);

        }

        public async Task<OperationResult> UpdateInstallation(InstallationModel updateModel)
        {
            Installation installation =
                await _dbContext.Installations.SingleOrDefaultAsync(x => x.Id == updateModel.Id);
            if (installation != null)
            {
                installation.Name = updateModel.Name;
                installation.Update(_dbContext);
            }

            List<InstallationSite> installationSites = _dbContext.InstallationSites.Where(x => x.InstallationId == updateModel.Id).ToList();
            List<InstallationSite> toBeRemovedInstallationSites = installationSites;

            foreach (DeployCheckbox deployedCheckbox in updateModel.DeployCheckboxes)
            {
                InstallationSite installationSite =
                    installationSites.SingleOrDefault(x => x.SDKSiteId == deployedCheckbox.Id);
                if (installationSite == null)
                {
                    installationSite = new InstallationSite
                    {
                        InstallationId = installation.Id,
                        SDKSiteId = deployedCheckbox.Id
                    };
                    installation.Create(_dbContext);
                }
                else
                {
                    if (installationSite.WorkflowState == Constants.WorkflowStates.Removed)
                    {
                        installationSite.WorkflowState = Constants.WorkflowStates.Created;
                        installationSite.Update(_dbContext);

                    } 
                    toBeRemovedInstallationSites.Remove(installationSite);
                }
            }

            foreach (InstallationSite installationSite in toBeRemovedInstallationSites)
            {
                installationSite.Delete(_dbContext);
            }
            return new OperationResult(true);
        }

        public async Task<OperationResult> DeleteInstallation(int id)
        {
            Installation installation =
                await _dbContext.Installations.SingleOrDefaultAsync(x => x.Id == id);
            installation.Delete(_dbContext);
            return new OperationResult(true);

        }
    }
}
