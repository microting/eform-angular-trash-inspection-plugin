import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {InstallationPnModel, InstallationPnUpdateModel} from 'src/app/plugins/modules/trash-inspection-pn/models/installation';
import {TrashInspectionsPnModel} from 'src/app/plugins/modules/trash-inspection-pn/models/trash-inspection';
import {TrashInspectionPnInstallationsService} from 'src/app/plugins/modules/trash-inspection-pn/services';

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
  selectedInstallationModel: InstallationPnModel = new InstallationPnModel();
  constructor(private trashInspectionPnInstallationsService: TrashInspectionPnInstallationsService) { }

  ngOnInit() {
  }

  show(installationModel: InstallationPnModel) {
    this.getSelectedInstallation(installationModel.id);
    this.frame.show();
  }

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

  addToEditMapping(e: any, trashInspectionId: number) {
    debugger;
    if (e.target.checked) {
      this.selectedInstallationModel.relatedMachinesIds.push(trashInspectionId);
    } else {
      this.selectedInstallationModel.relatedMachinesIds = this.selectedInstallationModel.relatedMachinesIds
        .filter(x => x !== trashInspectionId);
    }
  }

  isChecked(trashInspectionId: number) {
    if (this.selectedInstallationModel.relatedMachinesIds && this.selectedInstallationModel.relatedMachinesIds.length > 0) {
      return this.selectedInstallationModel.relatedMachinesIds.findIndex(x => x === trashInspectionId) !== -1;
    } return false;
  }
}
