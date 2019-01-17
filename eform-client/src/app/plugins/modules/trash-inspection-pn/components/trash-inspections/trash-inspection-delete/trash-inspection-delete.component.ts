import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MachinePnModel} from '../../../models';
import {TrashInspectionPnTrashInspectionsService} from '../../../services';

@Component({
  selector: 'app-machine-area-pn-machine-delete',
  templateUrl: './machine-delete.component.html',
  styleUrls: ['./machine-delete.component.scss']
})
export class TrashInspectionDeleteComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onMachineDeleted: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  selectedMachineModel: MachinePnModel = new MachinePnModel();
  constructor(private machineAreaPnMachinesService: TrashInspectionPnTrashInspectionsService) { }

  ngOnInit() {
  }

  show(machineModel: MachinePnModel) {
    this.selectedMachineModel = machineModel;
    this.frame.show();
  }

  deleteMachine() {
    this.spinnerStatus = true;
    this.machineAreaPnMachinesService.deleteMachine(this.selectedMachineModel.id).subscribe((data) => {
      if (data && data.success) {
        this.onMachineDeleted.emit();
        this.selectedMachineModel = new MachinePnModel();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }

}
