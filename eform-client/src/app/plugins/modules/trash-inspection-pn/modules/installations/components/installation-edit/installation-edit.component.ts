import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
} from '@angular/core';
import {
  InstallationPnModel,
  InstallationPnUpdateModel,
} from '../../../../models';
import {TrashInspectionPnInstallationsService} from '../../../../services';
import {AuthService, SitesService} from 'src/app/common/services';
import {
  SiteNameDto,
  DeployModel,
} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {TranslateService} from '@ngx-translate/core';
import {selectCurrentUserClaimsEformsPairingRead} from 'src/app/state';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-trash-inspection-pn-installation-edit',
  templateUrl: './installation-edit.component.html',
  styleUrls: ['./installation-edit.component.scss'],
  standalone: false
})
export class InstallationEditComponent implements OnInit {
  onInstallationUpdated: EventEmitter<void> = new EventEmitter<void>();
  deployViewModel: DeployModel = new DeployModel();
  selectedInstallationModel: InstallationPnModel = new InstallationPnModel();
  sitesDto: Array<SiteNameDto> = [];
  private selectCurrentUserClaimsEformsPairingRead$ = this.authStore.select(selectCurrentUserClaimsEformsPairingRead);

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Microting ID'), field: 'siteUId'},
    {header: this.translateService.stream('Name'), field: 'siteName'},
    {header: this.translateService.stream('Related Site'), field: 'deployCheckboxes'},
  ];

  constructor(
    private authStore: Store,
    private trashInspectionPnInstallationsService: TrashInspectionPnInstallationsService,
    private sitesService: SitesService,
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<InstallationEditComponent>,
    @Inject(MAT_DIALOG_DATA) private installationModel: InstallationPnModel
  ) {
    this.loadAllSites();
  }

  ngOnInit() {
  }

  getSelectedInstallation(id: number) {
    this.trashInspectionPnInstallationsService
      .getSingleInstallation(id)
      .subscribe((data) => {
        if (data && data.success) {
          this.selectedInstallationModel = data.model;
          this.fillCheckboxes();
        }
      });
  }

  updateInstallation() {
    this.trashInspectionPnInstallationsService
      .updateInstallation(
        new InstallationPnUpdateModel(this.selectedInstallationModel)
      )
      .subscribe((data) => {
        if (data && data.success) {
          this.onInstallationUpdated.emit();
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
          this.getSelectedInstallation(this.installationModel.id);
        }
      });
    }
    });
  }

  addToArray(checked: boolean, deployId: number) {
    if (checked) {
      this.selectedInstallationModel.deployCheckboxes =
        [...this.selectedInstallationModel.deployCheckboxes, {id: deployId, isChecked: true}];
    } else {
      this.selectedInstallationModel.deployCheckboxes = this.selectedInstallationModel.deployCheckboxes.filter(
        (x) => x.id !== deployId
      );
    }
  }

  fillCheckboxes() {
    this.deployViewModel = new DeployModel();
    for (const siteDto of this.sitesDto) {
      const i = this.selectedInstallationModel.deployCheckboxes.findIndex(x => x.id === siteDto.siteUId);
      let isChecked = false;
      if(i !== -1) {
        isChecked = this.selectedInstallationModel.deployCheckboxes[i].isChecked;
      }
      this.deployViewModel.deployCheckboxes = [...this.deployViewModel.deployCheckboxes, {id: siteDto.siteUId, isChecked: isChecked}];
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
    this.selectedInstallationModel = new InstallationPnModel();
    this.dialogRef.close();
  }
}
