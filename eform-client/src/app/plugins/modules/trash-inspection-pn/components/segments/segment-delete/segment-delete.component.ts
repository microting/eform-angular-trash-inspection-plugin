import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {
  TrashInspectionPnFractionsService
} from 'src/app/plugins/modules/trash-inspection-pn/services';
import {FractionPnModel} from '../../../models/fraction';

@Component({
  selector: 'app-trash-inspection-pn-segment-delete',
  templateUrl: './segment-delete.component.html',
  styleUrls: ['./segment-delete.component.scss']
})
export class SegmentDeleteComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onFractionDeleted: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  selectedFractionModel: FractionPnModel = new FractionPnModel();
  constructor(private trashInspectionPnFractionsService: TrashInspectionPnFractionsService) { }

  ngOnInit() {
  }

  show(fractionModel: FractionPnModel) {
    this.selectedFractionModel = fractionModel;
    this.frame.show();
  }

  deleteFraction() {
    this.spinnerStatus = true;
    this.trashInspectionPnFractionsService.deleteFraction(this.selectedFractionModel.id).subscribe((data) => {
      if (data && data.success) {
        this.onFractionDeleted.emit();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }
}
