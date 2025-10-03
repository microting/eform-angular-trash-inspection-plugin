import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
} from '@angular/core';
import {TrashInspectionPnSegmentsService} from '../../../../services';
import {SegmentPnModel} from '../../../../models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-trash-inspection-pn-segment-edit',
  templateUrl: './segment-edit.component.html',
  styleUrls: ['./segment-edit.component.scss'],
  standalone: false
})
export class SegmentEditComponent implements OnInit {
  onSegmentUpdated: EventEmitter<void> = new EventEmitter<void>();
  segmentPnModel: SegmentPnModel = new SegmentPnModel();
  typeahead = new EventEmitter<string>();

  constructor(
    private trashInspectionPnSegmentsService: TrashInspectionPnSegmentsService,
    public dialogRef: MatDialogRef<SegmentEditComponent>,
    @Inject(MAT_DIALOG_DATA) segmentPnModel: SegmentPnModel,
  ) {
    this.getSelectedFraction(segmentPnModel.id);
  }

  ngOnInit() {
  }

  getSelectedFraction(id: number) {
    this.trashInspectionPnSegmentsService
      .getSingleSegment(id)
      .subscribe((data) => {
        if (data && data.success) {
          this.segmentPnModel = data.model;
        }
      });
  }

  updateSegment() {
    this.trashInspectionPnSegmentsService
      .updateSegment(this.segmentPnModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.onSegmentUpdated.emit();
          this.hide();
        }
      });
  }

  hide() {
    this.segmentPnModel = new SegmentPnModel();
    this.dialogRef.close();
  }
}
