import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  TrashInspectionPnInstallationsService,
  TrashInspectionPnTrashInspectionsService
} from 'src/app/plugins/modules/trash-inspection-pn/services';
import {InstallationPnCreateModel,
        InstallationPnModel,
        InstallationsPnModel,
        TrashInspectionPnCreateModel,
        TrashInspectionsPnModel} from '../../../models';

@Component({
  selector: 'app-trash-inspection-pn-trash-inspection-create',
  templateUrl: './trash-inspection-create.component.html',
  styleUrls: ['./trash-inspection-create.component.scss']
})
export class TrashInspectionCreateComponent implements OnInit {
  @ViewChild('frame') frame;
  @Input() mappingInstallation: InstallationsPnModel = new InstallationsPnModel();
  @Output() onTrashInspectionCreated: EventEmitter<void> = new EventEmitter<void>();
  checked = false;
  spinnerStatus = false;
  newTrashInspectionModel: TrashInspectionPnCreateModel = new TrashInspectionPnCreateModel();

  constructor(private trashInspectionPnTrashInspectionsService: TrashInspectionPnTrashInspectionsService) { }

  ngOnInit() {

  }

  show() {
    this.frame.show();
  }

  createTrashInspection() {
    this.spinnerStatus = true;
    this.trashInspectionPnTrashInspectionsService.createTrashInspection(this.newTrashInspectionModel).subscribe((data) => {
      if (data && data.success) {
        this.onTrashInspectionCreated.emit();
        this.newTrashInspectionModel = new TrashInspectionPnCreateModel();
        this.frame.hide();
      }
      this.spinnerStatus = false;
    });
  }

  addToArray(e: any, installationId: number) {
    if (e.target.checked) {
      this.newTrashInspectionModel.relatedAreasIds.push(installationId);
    } else {
      this.newTrashInspectionModel.relatedAreasIds = this.newTrashInspectionModel.relatedAreasIds.filter(x => x !== installationId);
    }
  }

  isChecked(relatedInstallationId: number) {
    return this.newTrashInspectionModel.relatedAreasIds.indexOf(relatedInstallationId) !== -1;
  }
}
