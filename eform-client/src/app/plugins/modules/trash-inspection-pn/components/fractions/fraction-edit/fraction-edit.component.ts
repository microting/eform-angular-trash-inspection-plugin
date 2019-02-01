import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { InstallationPnUpdateModel} from 'src/app/plugins/modules/trash-inspection-pn/models/installation';
import {
  TrashInspectionPnFractionsService} from 'src/app/plugins/modules/trash-inspection-pn/services';
import {FractionPnModel, FractionPnUpdateModel} from '../../../models/fraction';

@Component({
  selector: 'app-trash-inspection-pn-fraction-edit',
  templateUrl: './fraction-edit.component.html',
  styleUrls: ['./fraction-edit.component.scss']
})
export class FractionEditComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onFractionUpdated: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  selectedFractionModel: FractionPnModel = new FractionPnModel();
  constructor(private trashInspectionPnFractionsService: TrashInspectionPnFractionsService) { }

  ngOnInit() {
  }

  show(fractionModel: FractionPnModel) {
    this.getSelectedFraction(fractionModel.id);
    this.frame.show();
  }

  getSelectedFraction(id: number) {
    this.spinnerStatus = true;
    this.trashInspectionPnFractionsService.getSingleFraction(id).subscribe((data) => {
      if (data && data.success) {
        this.selectedFractionModel = data.model;
      } this.spinnerStatus = false;
    });
  }

  updateFraction() {
    this.spinnerStatus = true;
    this.trashInspectionPnFractionsService.updateFraction(new FractionPnUpdateModel(this.selectedFractionModel))
      .subscribe((data) => {
      if (data && data.success) {
        this.onFractionUpdated.emit();
        this.selectedFractionModel = new FractionPnModel();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }

}
