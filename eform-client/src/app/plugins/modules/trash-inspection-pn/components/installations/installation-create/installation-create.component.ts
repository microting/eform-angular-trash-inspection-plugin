import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {} from 'src/app/plugins/modules/machine-area-pn/models/area';
import {AreaPnCreateModel, MachinesPnModel} from '../../../models';
import {TrashInspectionPnInstallationsService} from '../../../services';

@Component({
  selector: 'app-machine-area-pn-area-create',
  templateUrl: './area-create.component.html',
  styleUrls: ['./area-create.component.scss']
})
export class InstallationCreateComponent implements OnInit {
  @ViewChild('frame') frame;
  @Input() mappingMachines: MachinesPnModel = new MachinesPnModel();
  @Output() onAreaCreated: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  newAreaModel: AreaPnCreateModel = new AreaPnCreateModel();

  constructor(private machineAreaPnAreasService: TrashInspectionPnInstallationsService) { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  createArea() {
    this.spinnerStatus = true;
    this.machineAreaPnAreasService.createArea(this.newAreaModel).subscribe((data) => {
      if (data && data.success) {
        this.onAreaCreated.emit();
        this.newAreaModel = new AreaPnCreateModel();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }

  addToArray(e: any, machineId: number) {
    if (e.target.checked) {
      this.newAreaModel.relatedMachinesIds.push(machineId);
    } else {
      this.newAreaModel.relatedMachinesIds = this.newAreaModel.relatedMachinesIds.filter(x => x !== machineId);
    }
  }

  isChecked(relatedMachineId: number) {
    return this.newAreaModel.relatedMachinesIds.indexOf(relatedMachineId) !== -1;
  }
}
