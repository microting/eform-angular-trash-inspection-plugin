import {Component, OnInit, ViewChild} from '@angular/core';
import {PageSettingsModel} from 'src/app/common/models/settings';
import {InstallationPnRequestModel,
        InstallationsPnModel,
        InstallationPnModel} from 'src/app/plugins/modules/trash-inspection-pn/models/installation';
import {TrashInspectionsPnRequestModel, TrashInspectionsPnModel} from 'src/app/plugins/modules/trash-inspection-pn/models/trash-inspection';
import {
  TrashInspectionPnInstallationsService,
  TrashInspectionPnTrashInspectionsService
} from 'src/app/plugins/modules/trash-inspection-pn/services';
import {SharedPnService} from 'src/app/plugins/modules/shared/services';

@Component({
  selector: 'app-trash-inspection-pn-installations-page',
  templateUrl: './installations-page.component.html',
  styleUrls: ['./installations-page.component.scss']
})
export class InstallationsPageComponent implements OnInit {
  @ViewChild('createInspectionModal') createInspectionModal;
  @ViewChild('editInstallationModal') editInstallationModal;
  @ViewChild('deleteInstallationModal') deleteInstallationModal;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  installationsModel: InstallationsPnModel = new InstallationsPnModel();
  mappingTrashInspections: TrashInspectionsPnModel = new TrashInspectionsPnModel();
  installationRequestModel: InstallationPnRequestModel = new InstallationPnRequestModel();
  spinnerStatus = false;

  constructor(private sharedPnService: SharedPnService,
              private trashInspectionPnInstallationsService: TrashInspectionPnInstallationsService,
              private trashInspectionPnTrashInspectionsService: TrashInspectionPnTrashInspectionsService) { }

  ngOnInit() {
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.sharedPnService.getLocalPageSettings
    ('trashInspectionsPnSettings', 'Installations').settings;
    this.getAllInitialData();
  }

  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings
    ('trashInspectionsPnSettings', this.localPageSettings, 'Installations');
    this.getAllInstallations();
  }

  getAllInitialData() {
    this.getAllInstallations();
    this.getTrashInspectionsForMapping();
  }

  getAllInstallations() {
    this.spinnerStatus = true;
    this.installationRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.installationRequestModel.sort = this.localPageSettings.sort;
    this.installationRequestModel.pageSize = this.localPageSettings.pageSize;
    this.trashInspectionPnInstallationsService.getAllInstallations(this.installationRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.installationsModel = data.model;
      } this.spinnerStatus = false;
    });
  }

  getTrashInspectionsForMapping() {
    this.spinnerStatus = true;
    this.trashInspectionPnTrashInspectionsService.getAllTrashInspections(new TrashInspectionsPnRequestModel()).subscribe((data) => {
      if (data && data.success) {
        this.mappingTrashInspections = data.model;
      } this.spinnerStatus = false;
    });
  }

  showEditInstallationModal(installation: InstallationPnModel) {
    this.editInstallationModal.show(installation);
  }

  showDeleteInstallationModal(installation: InstallationPnModel) {
    this.deleteInstallationModal.show(installation);
  }

  showCreateInstallationModal() {
    this.createInspectionModal.show();
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
      this.installationRequestModel.offset = e;
      if (e === 0) {
        this.installationRequestModel.pageIndex = 0;
      } else {
        this.installationRequestModel.pageIndex
          = Math.floor(e / this.installationRequestModel.pageSize);
      }
      this.getAllInstallations();
    }
  }

}
