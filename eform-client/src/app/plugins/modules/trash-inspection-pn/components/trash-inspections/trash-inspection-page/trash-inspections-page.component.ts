import {Component, OnInit, ViewChild} from '@angular/core';
import {PageSettingsModel} from 'src/app/common/models/settings';
import {
  MachinesPnRequestModel,
  MachinesPnModel,
  AreasPnModel,
  AreasPnRequestModel,
  MachinePnModel
} from '../../../models';
import {TrashInspectionPnInstallationsService, TrashInspectionPnTrashInspectionsService} from '../../../services';
import {SharedPnService} from '../../../../shared/services';
import {AuthService} from '../../../../../../common/services/auth';

@Component({
  selector: 'app-machine-area-pn-machines-page',
  templateUrl: './machines-page.component.html',
  styleUrls: ['./machines-page.component.scss']
})
export class TrashInspectionsPageComponent implements OnInit {
  @ViewChild('createMachineModal') createMachineModal;
  @ViewChild('editMachineModal') editMachineModal;
  @ViewChild('deleteMachineModal') deleteMachineModal;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  machinesModel: MachinesPnModel = new MachinesPnModel();
  machinesRequestModel: MachinesPnRequestModel = new MachinesPnRequestModel();
  mappingAreas: AreasPnModel = new AreasPnModel();
  spinnerStatus = false;

  constructor(private sharedPnService: SharedPnService,
              private machineAreaPnMachinesService: TrashInspectionPnTrashInspectionsService,
              private authService: AuthService,
              private machineAreaPnAreasService: TrashInspectionPnInstallationsService) { }
  get currentRole(): string {
    return this.authService.currentRole;
  }
  ngOnInit() {
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.sharedPnService.getLocalPageSettings
    ('machinesPnSettings', 'Machines').settings;
    this.getAllInitialData();
  }

  updateLocalPageSettings() {
    debugger;
    this.sharedPnService.updateLocalPageSettings
    ('machinesPnSettings', this.localPageSettings, 'Machines');
    this.getLocalPageSettings();
  }

  getAllInitialData() {
    this.getAllMachines();
    this.getMappedAreas();
  }

  getAllMachines() {
    this.spinnerStatus = true;
    this.machinesRequestModel.pageSize = this.localPageSettings.pageSize;
    this.machinesRequestModel.sort = this.localPageSettings.sort;
    this.machinesRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.machineAreaPnMachinesService.getAllMachines(this.machinesRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.machinesModel = data.model;
      } this.spinnerStatus = false;
    });
  }

  getMappedAreas() {
    this.spinnerStatus = true;
    this.machineAreaPnAreasService.getAllAreas(new AreasPnRequestModel()).subscribe((data) => {
      if (data && data.success) {
        this.mappingAreas = data.model;
      } this.spinnerStatus = false;
    });
  }

  showEditMachineModal(machine: MachinePnModel) {
    this.editMachineModal.show(machine);
  }

  showDeleteMachineModal(machine: MachinePnModel) {
    this.deleteMachineModal.show(machine);
  }

  showCreateMachineModal() {
    this.createMachineModal.show();
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
      this.machinesRequestModel.offset = e;
      if (e === 0) {
        this.machinesRequestModel.pageIndex = 0;
      } else {
        this.machinesRequestModel.pageIndex
          = Math.floor(e / this.machinesRequestModel.pageSize);
      }
      this.getAllMachines();
    }
  }
}
