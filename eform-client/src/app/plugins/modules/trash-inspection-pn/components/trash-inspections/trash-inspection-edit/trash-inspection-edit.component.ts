import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  AreaPnModel, AreasPnModel,
  MachinePnModel,
  MachinePnUpdateModel
} from '../../../models';
import {
  TrashInspectionPnTrashInspectionsService
} from '../../../services';

@Component({
  selector: 'app-machine-area-pn-machine-edit',
  templateUrl: './machine-edit.component.html',
  styleUrls: ['./machine-edit.component.scss']
})
export class TrashInspectionEditComponent implements OnInit {
  @ViewChild('frame') frame;
  @Input() mappingAreas: AreasPnModel = new AreasPnModel();
  @Output() onMachineUpdated: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  selectedMachineModel: MachinePnModel = new MachinePnModel();
  constructor(private machineAreaPnMachinesService: TrashInspectionPnTrashInspectionsService) { }

  ngOnInit() {
  }

  show(machineModel: MachinePnModel) {
    this.getSelectedMachine(machineModel.id);
    this.frame.show();
  }

  getSelectedMachine(id: number) {
    this.spinnerStatus = true;
    this.machineAreaPnMachinesService.getSingleMachine(id).subscribe((data) => {
      if (data && data.success) {
        this.selectedMachineModel = data.model;
      } this.spinnerStatus = false;
    });
  }

  updateMachine() {
    this.spinnerStatus = true;
    this.machineAreaPnMachinesService.updateMachine(new MachinePnUpdateModel(this.selectedMachineModel))
      .subscribe((data) => {
      if (data && data.success) {
        this.onMachineUpdated.emit();
        this.selectedMachineModel = new MachinePnModel();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }

  addToEditMapping(e: any, areaId: number) {
    if (e.target.checked) {
      this.selectedMachineModel.relatedAreasIds.push(areaId);
    } else {
      this.selectedMachineModel.relatedAreasIds = this.selectedMachineModel.relatedAreasIds.filter(x => x !== areaId);
    }
  }

  isChecked(areaId: number) {
    if (this.selectedMachineModel.relatedAreasIds && this.selectedMachineModel.relatedAreasIds.length > 0) {
      return this.selectedMachineModel.relatedAreasIds.findIndex(x => x === areaId) !== -1;
    } return false;
  }

}
