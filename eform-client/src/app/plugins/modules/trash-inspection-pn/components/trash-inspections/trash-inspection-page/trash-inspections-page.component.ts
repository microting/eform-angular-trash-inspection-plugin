import {Component, OnInit, ViewChild} from '@angular/core';
import {PageSettingsModel} from 'src/app/common/models/settings';
import {
  TrashInspectionsPnRequestModel,
  TrashInspectionsPnModel,
  InstallationsPnModel,
  InstallationPnRequestModel,
  TrashInspectionPnModel
} from '../../../models';
import {TrashInspectionPnInstallationsService, TrashInspectionPnTrashInspectionsService} from '../../../services';
import {SharedPnService} from '../../../../shared/services';
import {AuthService} from '../../../../../../common/services/auth';

@Component({
  selector: 'app-trash-inspection-pn-trash-inspection-page',
  templateUrl: './trash-inspections-page.component.html',
  styleUrls: ['./trash-inspections-page.component.scss']
})
export class TrashInspectionsPageComponent implements OnInit {
  @ViewChild('createTrashInspectionModal') createTrashInspectionModal;
  @ViewChild('editTrashInspectionModal') editTrashInspectionModal;
  @ViewChild('deleteTrashInspectionModal') deleteTrashInspectionModal;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  trashInspectionsModel: TrashInspectionsPnModel = new TrashInspectionsPnModel();
  trashInspectionsRequestModel: TrashInspectionsPnRequestModel = new TrashInspectionsPnRequestModel();
  mappingInstallations: InstallationsPnModel = new InstallationsPnModel();
  spinnerStatus = false;
  constructor(private sharedPnService: SharedPnService,
              private trashInspectionPnTrashInspectionsService: TrashInspectionPnTrashInspectionsService,
              private authService: AuthService,
              private trashInspectionPnInstallationsService: TrashInspectionPnInstallationsService) { }
  get currentRole(): string {
    return this.authService.currentRole;
  }
  ngOnInit() {
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    let bla = this.sharedPnService.getLocalPageSettings
    ('trashInspectionsPnSettings', 'TrashInspections');
    this.localPageSettings = bla.settings;
    this.getAllInitialData();
  }

  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings
    ('trashInspectionsPnSettings', this.localPageSettings, 'TrashInspections');
    this.getLocalPageSettings();
  }

  getAllInitialData() {
    this.getAllTrashInspections();
    this.getMappedInstallations();
  }

  getAllTrashInspections() {
    this.spinnerStatus = true;
    this.trashInspectionsRequestModel.pageSize = this.localPageSettings.pageSize;
    this.trashInspectionsRequestModel.sort = this.localPageSettings.sort;
    this.trashInspectionsRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.trashInspectionPnTrashInspectionsService.getAllTrashInspections(this.trashInspectionsRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.trashInspectionsModel = data.model;
      } this.spinnerStatus = false;
    });
  }

  getMappedInstallations() {
    this.spinnerStatus = true;
    this.trashInspectionPnInstallationsService.getAllInstallations(new InstallationPnRequestModel()).subscribe((data) => {
      if (data && data.success) {
        this.mappingInstallations = data.model;
      } this.spinnerStatus = false;
    });
  }

  showEditTrashInspectionModal(trashInspection: TrashInspectionPnModel) {
    this.editTrashInspectionModal.show(trashInspection);
  }

  showDeleteTrashInspectionModal(trashInspection: TrashInspectionPnModel) {
    this.deleteTrashInspectionModal.show(trashInspection);
  }

  downloadPDF(trashInspection: any) {
    window.open('/api/trash-inspection-pn/inspection-results/' +
      trashInspection.weighingNumber + '?token=WH4YajYqNAfdsSbFaYa2gr2BWiRcOv1V&fileType=pdf', '_blank');
  }

  showCreateTrashInspectionModal() {
    this.createTrashInspectionModal.show();
  }

  sortTable(sort: string) {
    if (this.localPageSettings.sort === sort) {
      this.localPageSettings.isSortDsc = !this.localPageSettings.isSortDsc;
    } else {
      this.localPageSettings.isSortDsc = false;
      this.localPageSettings.sort = sort;
    }
    this.updateLocalPageSettings();
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.trashInspectionsRequestModel.offset = e;
      if (e === 0) {
        this.trashInspectionsRequestModel.pageIndex = 0;
      } else {
        this.trashInspectionsRequestModel.pageIndex
          = Math.floor(e / this.trashInspectionsRequestModel.pageSize);
      }
      this.getAllTrashInspections();
    }
  }
}
