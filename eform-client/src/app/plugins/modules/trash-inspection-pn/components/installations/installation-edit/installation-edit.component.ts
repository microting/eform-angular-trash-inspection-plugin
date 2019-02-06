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
  @ViewChild('frame') frame;
  @Input() mappingTrashInspections: TrashInspectionsPnModel = new TrashInspectionsPnModel();
  @Output() onInstallationUpdated: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  newInstallationModel: InstallationPnCreateModel = new InstallationPnCreateModel();
  selectedInstallationModel: InstallationPnModel = new InstallationPnModel();
  sitesDto: Array<SiteNameDto> = [];
  deployModel: DeployModel = new DeployModel();
  deployViewModel: DeployModel = new DeployModel();
  matchFound = false;

  get userClaims() {
    return this.authService.userClaims;
  }
  constructor(private trashInspectionPnInstallationsService: TrashInspectionPnInstallationsService,
              private sitesService: SitesService,
              private authService: AuthService) { }

  ngOnInit() {
    this.loadAllSites();

  }

  // show(installationModel: InstallationPnModel) {
  //   this.getSelectedInstallation(installationModel.id);
  //   this.frame.show();
  // }

  getSelectedInstallation(id: number) {
    this.spinnerStatus = true;
    this.trashInspectionPnInstallationsService.getSingleInstallation(id).subscribe((data) => {
      if (data && data.success) {
        this.selectedInstallationModel = data.model;
      } this.spinnerStatus = false;
    });
  }

  updateInstallation() {
    this.spinnerStatus = true;
    this.trashInspectionPnInstallationsService.updateInstallation(new InstallationPnUpdateModel(this.selectedInstallationModel))
      .subscribe((data) => {
      if (data && data.success) {
        this.onInstallationUpdated.emit();
        this.selectedInstallationModel = new InstallationPnModel();
        this.frame.hide();
      } this.spinnerStatus = false;
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

  show() {
    this.deployModel = new DeployModel();
    this.deployViewModel = new DeployModel();
    this.fillCheckboxes();
    this.frame.show();
  }

  addToArray(e: any, deployId: number) {
    const deployObject = new DeployCheckbox();
    deployObject.id = deployId;
    if (e.target.checked) {
      deployObject.isChecked = true;
      this.newInstallationModel.deployCheckboxes.push(deployObject);
    } else {
      this.newInstallationModel.deployCheckboxes = this.newInstallationModel.deployCheckboxes.filter(x => x.id !== deployId);
    }
  }

  fillCheckboxes() {
    for (const siteDto of this.sitesDto) {
      const deployObject = new DeployCheckbox();
      // debugger;
      // for (const deployedSite of this.newInstallationModel.deployedSites) {
      //   if (deployedSite.siteUId === siteDto.siteUId) {
      //     this.matchFound = true;
      //     deployObject.id = siteDto.siteUId;
      //     deployObject.isChecked = true;
      //     this.deployModel.deployCheckboxes.push(deployObject);
      //   }
      // }
      this.deployViewModel.id = this.newInstallationModel.id;
      deployObject.id = siteDto.siteUId;
      deployObject.isChecked = this.matchFound === true;
      this.matchFound = false;
      this.deployViewModel.deployCheckboxes.push(deployObject);
    }
  }
  // loadAllSites() {
  //   if (this.userClaims.eFormsPairingRead) {
  //     this.sitesService.getAllSitesForPairing().subscribe(operation => {
  //       this.spinnerStatus = true;
  //       if (operation && operation.success) {
  //         this.sitesDto = operation.model;
  //       }
  //       this.spinnerStatus = false;
  //     });
  //   }
  // }
  // addToEditMapping(e: any, trashInspectionId: number) {
  //   debugger;
  //   if (e.target.checked) {
  //     this.selectedInstallationModel.relatedMachinesIds.push(trashInspectionId);
  //   } else {
  //     this.selectedInstallationModel.relatedMachinesIds = this.selectedInstallationModel.relatedMachinesIds
  //       .filter(x => x !== trashInspectionId);
  //   }
  // }
  //
  // isChecked(trashInspectionId: number) {
  //   if (this.selectedInstallationModel.relatedMachinesIds && this.selectedInstallationModel.relatedMachinesIds.length > 0) {
  //     return this.selectedInstallationModel.relatedMachinesIds.findIndex(x => x === trashInspectionId) !== -1;
  //   } return false;
  // }
}
