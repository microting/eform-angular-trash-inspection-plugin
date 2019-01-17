import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {InstallationPnCreateModel, TrashInspectionsPnModel} from '../../../models';
import {TrashInspectionPnInstallationsService} from '../../../services';

@Component({
  selector: 'app-trash-inspection-pn-installation-create',
  templateUrl: './installation-create.component.html',
  styleUrls: ['./installation-create.component.scss']
})
export class InstallationCreateComponent implements OnInit {
  @ViewChild('frame') frame;
  @Input() mappingTrashInspections: TrashInspectionsPnModel = new TrashInspectionsPnModel();
  @Output() onInstallationCreated: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  newInstallationModel: InstallationPnCreateModel = new InstallationPnCreateModel();

  constructor(private trashInspectionPnInstallationsService: TrashInspectionPnInstallationsService) { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  createInstallation() {
    this.spinnerStatus = true;
    this.trashInspectionPnInstallationsService.createInstallation(this.newInstallationModel).subscribe((data) => {
      if (data && data.success) {
        this.onInstallationCreated.emit();
        this.newInstallationModel = new InstallationPnCreateModel();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }

  addToArray(e: any, machineId: number) {
    if (e.target.checked) {
      this.newInstallationModel.relatedMachinesIds.push(machineId);
    } else {
      this.newInstallationModel.relatedMachinesIds = this.newInstallationModel.relatedMachinesIds.filter(x => x !== machineId);
    }
  }

  isChecked(relatedMachineId: number) {
    return this.newInstallationModel.relatedMachinesIds.indexOf(relatedMachineId) !== -1;
  }
}
