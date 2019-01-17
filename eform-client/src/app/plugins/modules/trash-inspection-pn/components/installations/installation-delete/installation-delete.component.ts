import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AreaPnModel, AreaPnUpdateModel} from 'src/app/plugins/modules/machine-area-pn/models/area';
import {MachineAreaPnAreasService} from 'src/app/plugins/modules/machine-area-pn/services';

@Component({
  selector: 'app-machine-area-pn-area-delete',
  templateUrl: './area-delete.component.html',
  styleUrls: ['./area-delete.component.scss']
})
export class InstallationDeleteComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onAreaDeleted: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  selectedAreaModel: AreaPnModel = new AreaPnModel();
  constructor(private machineAreaPnAreasService: MachineAreaPnAreasService) { }

  ngOnInit() {
  }

  show(areaModel: AreaPnModel) {
    this.selectedAreaModel = areaModel;
    this.frame.show();
  }

  deleteArea() {
    this.spinnerStatus = true;
    this.machineAreaPnAreasService.deleteArea(this.selectedAreaModel.id).subscribe((data) => {
      if (data && data.success) {
        this.onAreaDeleted.emit();
        this.selectedAreaModel = new AreaPnModel();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }
}
