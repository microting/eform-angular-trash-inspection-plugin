import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AreaPnModel, AreaPnUpdateModel} from 'src/app/plugins/modules/machine-area-pn/models/area';
import {MachinesPnModel} from 'src/app/plugins/modules/machine-area-pn/models/machine';
import {MachineAreaPnAreasService} from 'src/app/plugins/modules/machine-area-pn/services';

@Component({
  selector: 'app-machine-area-pn-area-edit',
  templateUrl: './area-edit.component.html',
  styleUrls: ['./area-edit.component.scss']
})
export class InstallationEditComponent implements OnInit {
  @ViewChild('frame') frame;
  @Input() mappingMachines: MachinesPnModel = new MachinesPnModel();
  @Output() onAreaUpdated: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  selectedAreaModel: AreaPnModel = new AreaPnModel();
  constructor(private machineAreaPnAreasService: MachineAreaPnAreasService) { }

  ngOnInit() {
  }

  show(areaModel: AreaPnModel) {
    this.getSelectedArea(areaModel.id);
    this.frame.show();
  }

  getSelectedArea(id: number) {
    this.spinnerStatus = true;
    this.machineAreaPnAreasService.getSingleArea(id).subscribe((data) => {
      if (data && data.success) {
        this.selectedAreaModel = data.model;
      } this.spinnerStatus = false;
    });
  }

  updateArea() {
    this.spinnerStatus = true;
    this.machineAreaPnAreasService.updateArea(new AreaPnUpdateModel(this.selectedAreaModel)).subscribe((data) => {
      if (data && data.success) {
        this.onAreaUpdated.emit();
        this.selectedAreaModel = new AreaPnModel();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }

  addToEditMapping(e: any, machineId: number) {
    debugger;
    if (e.target.checked) {
      this.selectedAreaModel.relatedMachinesIds.push(machineId);
    } else {
      this.selectedAreaModel.relatedMachinesIds = this.selectedAreaModel.relatedMachinesIds.filter(x => x !== machineId);
    }
  }

  isChecked(machineId: number) {
    if (this.selectedAreaModel.relatedMachinesIds && this.selectedAreaModel.relatedMachinesIds.length > 0) {
      return this.selectedAreaModel.relatedMachinesIds.findIndex(x => x === machineId) !== -1;
    } return false;
  }
}
