import {
  Component,
  EventEmitter,
  OnInit,
  inject
} from '@angular/core';
import {InstallationPnCreateModel, InstallationPnModel} from '../../../../models';
import {TrashInspectionPnInstallationsService} from '../../../../services';
import {DeployCheckbox, DeployModel, SiteNameDto} from 'src/app/common/models';
import {AuthService, SitesService} from 'src/app/common/services';
import {MatDialogRef} from '@angular/material/dialog';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {TranslateService} from '@ngx-translate/core';
import {selectCurrentUserClaimsEformsPairingRead} from 'src/app/state';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-trash-inspection-pn-installation-create',
  templateUrl: './installation-create.component.html',
  styleUrls: ['./installation-create.component.scss'],
  standalone: false
})
export class InstallationCreateComponent implements OnInit {
  private authStore = inject(Store);
  private trashInspectionPnInstallationsService = inject(TrashInspectionPnInstallationsService);
  private sitesService = inject(SitesService);
  private authService = inject(AuthService);
  public dialogRef = inject(MatDialogRef<InstallationCreateComponent>);
  private translateService = inject(TranslateService);

  installationCreated: EventEmitter<void> = new EventEmitter<void>();
  newInstallationModel: InstallationPnCreateModel = new InstallationPnCreateModel();
  sitesDto: Array<SiteNameDto> = [];
  deployViewModel: DeployModel = new DeployModel();
  matchFound = false;
  private selectCurrentUserClaimsEformsPairingRead$ = this.authStore.select(selectCurrentUserClaimsEformsPairingRead);

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Microting ID'), field: 'siteUId'},
    {header: this.translateService.stream('Name'), field: 'siteName'},
    {header: this.translateService.stream('Check to pair'), field: 'deployCheckboxes'},
  ];

  

  ngOnInit() {
    this.deployViewModel = new DeployModel();
    this.fillCheckboxes();
    this.loadAllSites();
  }

  createInstallation() {
    this.trashInspectionPnInstallationsService
      .createInstallation(this.newInstallationModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.installationCreated.emit();
          this.hide();
        }
      });
  }

  loadAllSites() {
    this.selectCurrentUserClaimsEformsPairingRead$.subscribe((x) => {
      if (x) {
      this.sitesService.getAllSitesForPairing().subscribe((operation) => {
        if (operation && operation.success) {
          this.sitesDto = operation.model;
        }
      });
    }
    });
  }

  addToArray(checked: boolean, deployId: number) {
    if (checked) {
      this.newInstallationModel.deployCheckboxes = [...this.newInstallationModel.deployCheckboxes, {id: deployId, isChecked: true}];
    } else {
      this.newInstallationModel.deployCheckboxes = this.newInstallationModel.deployCheckboxes.filter(
        (x) => x.id !== deployId
      );
    }
  }

  fillCheckboxes() {
    for (const siteDto of this.sitesDto) {
      const deployObject = new DeployCheckbox();
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

  getCheckboxValueBySiteId(siteId: number): boolean {
    const i = this.deployViewModel.deployCheckboxes.findIndex(x => x.id === siteId);
    if(i !== -1) {
      return this.deployViewModel.deployCheckboxes[i].isChecked;
    }
    return false;
  }

  hide() {
    this.newInstallationModel = new InstallationPnCreateModel();
    this.dialogRef.close();
  }
}
