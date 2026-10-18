import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatDialogTitle, MatDialogContent, MatDialogActions} from '@angular/material/dialog';
import {
  Component,
  EventEmitter,
  OnInit,
  inject
} from '@angular/core';
import {TrashInspectionPnSegmentsService} from '../../../../services';
import {SegmentPnModel} from '../../../../models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-trash-inspection-pn-segment-edit',
  templateUrl: './segment-edit.component.html',
  styleUrls: ['./segment-edit.component.scss'],
  imports: [TranslatePipe, FormsModule, MatFormField, MatLabel, MatInput, MatButton, MatDialogTitle, MatDialogContent, MatDialogActions],
})
export class SegmentEditComponent implements OnInit {
  private trashInspectionPnSegmentsService = inject(TrashInspectionPnSegmentsService);
  public dialogRef = inject(MatDialogRef<SegmentEditComponent>);
  private segmentPnModelParam = inject<SegmentPnModel>(MAT_DIALOG_DATA);

  onSegmentUpdated: EventEmitter<void> = new EventEmitter<void>();
  segmentPnModel: SegmentPnModel = new SegmentPnModel();
  typeahead = new EventEmitter<string>();

  

  ngOnInit() {
    this.getSelectedFraction(this.segmentPnModelParam.id);
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
