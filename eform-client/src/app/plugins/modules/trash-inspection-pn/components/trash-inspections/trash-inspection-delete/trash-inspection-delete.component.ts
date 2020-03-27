import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {TrashInspectionPnModel} from '../../../models';
import {TrashInspectionPnTrashInspectionsService} from '../../../services';

@Component({
  selector: 'app-trash-inspection-pn-trash-inspection-delete',
  templateUrl: './trash-inspection-delete.component.html',
  styleUrls: ['./trash-inspection-delete.component.scss']
})
export class TrashInspectionDeleteComponent implements OnInit {
  @ViewChild('frame', {static: false}) frame;
  @Output() onTrashInspectionDeleted: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  selectedTrashInspectionModel: TrashInspectionPnModel = new TrashInspectionPnModel();
  constructor(private machineAreaPnMachinesService: TrashInspectionPnTrashInspectionsService) { }

  ngOnInit() {
  }

  show(trashInspectionModel: TrashInspectionPnModel) {
    this.selectedTrashInspectionModel = trashInspectionModel;
    this.frame.show();
  }

  deleteTrashInspection() {
    this.spinnerStatus = true;
    this.machineAreaPnMachinesService.deleteTrashInspection(this.selectedTrashInspectionModel.id).subscribe((data) => {
      if (data && data.success) {
        this.onTrashInspectionDeleted.emit();
        this.selectedTrashInspectionModel = new TrashInspectionPnModel();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }

}
