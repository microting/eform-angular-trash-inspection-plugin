import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {InstallationPnCreateModel, TrashInspectionsPnModel} from '../../../models';
import {TrashInspectionPnInstallationsService} from '../../../services';
import {SiteNameDto, TemplateDto} from '../../../../../../common/models/dto';
import {DeployCheckbox, DeployModel} from '../../../../../../common/models/eforms';
import {EFormService} from '../../../../../../common/services/eform';
import {SitesService} from '../../../../../../common/services/advanced';
import {AuthService} from '../../../../../../common/services/auth';

@Component({
  selector: 'app-trash-inspection-pn-installation-create',
  templateUrl: './installation-create.component.html',
  styleUrls: ['./installation-create.component.scss']
})
export class InstallationCreateComponent implements OnInit {
  @ViewChild('frame') frame;
  @Input() mappingTrashInspections: TrashInspectionsPnModel = new TrashInspectionsPnModel();
  @Output() onInstallationCreated: EventEmitter<void> = new EventEmitter<void>();
  @Output() onDeploymentFinished: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  newInstallationModel: InstallationPnCreateModel = new InstallationPnCreateModel();
  sitesDto: Array<SiteNameDto> = [];
  deployModel: DeployModel = new DeployModel();
  deployViewModel: DeployModel = new DeployModel();
  matchFound = false;

  get userClaims() {
    return this.authService.userClaims;
  }
  constructor(private trashInspectionPnInstallationsService: TrashInspectionPnInstallationsService,
              private sitesService: SitesService,
              private authService: AuthService,
              private eFormService: EFormService) { }

  ngOnInit() {
    this.loadAllSites();
  }

  createInstallation() {
    this.spinnerStatus = true;
    this.trashInspectionPnInstallationsService.createInstallation(this.newInstallationModel).subscribe((data) => {
      if (data && data.success) {
        this.onInstallationCreated.emit();
        // this.submitDeployment();
        this.newInstallationModel = new InstallationPnCreateModel();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }

  // isChecked(relatedMachineId: number) {
  //   return this.newInstallationModel.relatedMachinesIds.indexOf(relatedMachineId) !== -1;
  // }

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

  // submitDeployment() {
  //   this.spinnerStatus = true;
  //   // this.deployModel.id = this.newInstallationModel.id;
  //   this.eFormService.deploySingle(this.deployModel).subscribe(operation => {
  //     if (operation && operation.success) {
  //       this.frame.hide();
  //       this.onDeploymentFinished.emit();
  //     }
  //     this.spinnerStatus = false;
  //   });
  // }
}
