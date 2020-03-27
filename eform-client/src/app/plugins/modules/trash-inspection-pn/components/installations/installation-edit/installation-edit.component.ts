import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  InstallationPnCreateModel,
  InstallationPnModel,
  InstallationPnUpdateModel
} from 'src/app/plugins/modules/trash-inspection-pn/models/installation';
import {TrashInspectionsPnModel} from 'src/app/plugins/modules/trash-inspection-pn/models/trash-inspection';
import {TrashInspectionPnInstallationsService} from 'src/app/plugins/modules/trash-inspection-pn/services';
import {SitesService} from '../../../../../../common/services/advanced';
import {AuthService} from '../../../../../../common/services/auth';
import {SiteNameDto} from '../../../../../../common/models/dto';
import {DeployCheckbox, DeployModel} from '../../../../../../common/models/eforms';

@Component({
  selector: 'app-trash-inspection-pn-installation-edit',
  templateUrl: './installation-edit.component.html',
  styleUrls: ['./installation-edit.component.scss']
})
export class InstallationEditComponent implements OnInit {
  @ViewChild('frame', {static: false}) frame;
  @Output() onInstallationUpdated: EventEmitter<void> = new EventEmitter<void>();

  deployModel: DeployModel = new DeployModel();
  deployViewModel: DeployModel = new DeployModel();
  selectedInstallationModel: InstallationPnModel = new InstallationPnModel();
  sitesDto: Array<SiteNameDto> = [];
  matchFound = false;
  spinnerStatus = false;
  get userClaims() {
    return this.authService.userClaims;
  }

  constructor(private trashInspectionPnInstallationsService: TrashInspectionPnInstallationsService,
              private sitesService: SitesService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.loadAllSites();
    this.selectedInstallationModel.deployCheckboxes = new Array<DeployCheckbox>();

  }

  show(installationModel: InstallationPnModel) {
    this.getSelectedInstallation(installationModel.id);
    this.deployViewModel = new DeployModel();
    this.frame.show();
  }

  getSelectedInstallation(id: number) {
    // debugger;
    this.spinnerStatus = true;
    this.trashInspectionPnInstallationsService.getSingleInstallation(id).subscribe((data) => {
      if (data && data.success) {
        this.selectedInstallationModel = data.model;
        this.fillCheckboxes();
      }
      this.spinnerStatus = false;
    });
  }

  updateInstallation() {
    // debugger;
    this.spinnerStatus = true;
    this.trashInspectionPnInstallationsService.updateInstallation(new InstallationPnUpdateModel(this.selectedInstallationModel))
      .subscribe((data) => {
        if (data && data.success) {
          this.onInstallationUpdated.emit();
          this.selectedInstallationModel = new InstallationPnModel();
          this.frame.hide();
        }
        this.spinnerStatus = false;
      });
  }

  loadAllSites() {
    if (this.userClaims.eFormsPairingRead) {
      this.sitesService.getAllSitesForPairing().subscribe(operation => {
        this.spinnerStatus = true;
        if (operation && operation.success) {
          this.sitesDto = operation.model;
        }
        this.spinnerStatus = false;
      });
    }
  }

  addToEditMapping(e: any, sdkSiteId: number) {
    if (e.target.checked) {
      this.selectedInstallationModel.SdkSiteIds.push(sdkSiteId);
    } else {
      this.selectedInstallationModel.SdkSiteIds = this.selectedInstallationModel.SdkSiteIds
        .filter(x => x !== sdkSiteId);
    }
  }

  addToArray(e: any, deployId: number) {
    // debugger;
    const deployObject = new DeployCheckbox();
    deployObject.id = deployId;
    if (e.target.checked) {
      deployObject.isChecked = true;
      this.selectedInstallationModel.deployCheckboxes.push(deployObject);
    } else {
      this.selectedInstallationModel.deployCheckboxes = this.selectedInstallationModel.deployCheckboxes.filter(x => x.id !== deployId);
    }
  }

  // isChecked(sdkSiteId: number) {
  //   debugger;
  //   if (this.selectedInstallationModel.SdkSiteIds && this.selectedInstallationModel.SdkSiteIds.length > 0) {
  //     return this.selectedInstallationModel.SdkSiteIds.findIndex(x => x === sdkSiteId) !== -1;
  //   }
  //   return false;
  // }

  fillCheckboxes() {
    for (const siteDto of this.sitesDto) {
      const deployObject = new DeployCheckbox();
      for (const deployCheckboxes of this.selectedInstallationModel.deployCheckboxes) {
        if (deployCheckboxes.id === siteDto.siteUId) {
          this.matchFound = true;
          deployObject.id = siteDto.siteUId;
          deployObject.isChecked = true;
          this.deployModel.deployCheckboxes.push(deployObject);
        }
      }
      this.deployViewModel.id = this.selectedInstallationModel.id;
      deployObject.id = siteDto.siteUId;
      deployObject.isChecked = this.matchFound === true;
      this.matchFound = false;
      this.deployViewModel.deployCheckboxes.push(deployObject);
    }
  }
}
