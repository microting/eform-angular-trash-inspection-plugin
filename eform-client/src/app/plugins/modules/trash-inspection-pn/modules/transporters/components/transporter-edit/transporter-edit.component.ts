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
import {ProducerPnModel, TransporterPnModel} from '../../../../models';
import {TrashInspectionPnTransporterService} from '../../../../services';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-trash-inspection-pn-transporter-edit',
  templateUrl: './transporter-edit.component.html',
  styleUrls: ['./transporter-edit.component.scss'],
  imports: [TranslatePipe, FormsModule, MatFormField, MatLabel, MatInput, MatButton, MatDialogTitle, MatDialogContent, MatDialogActions],
})
export class TransporterEditComponent implements OnInit {
  private trashInspectionPnTransporterService = inject(TrashInspectionPnTransporterService);
  public dialogRef = inject(MatDialogRef<TransporterEditComponent>);
  private transporterModel = inject<TransporterPnModel>(MAT_DIALOG_DATA);

  transporterUpdated: EventEmitter<void> = new EventEmitter<void>();
  public selectedTransporter: TransporterPnModel = new TransporterPnModel();

  

  ngOnInit() {
    this.getSelectedProducer(this.transporterModel.id);
  }

  getSelectedProducer(id: number) {
    this.trashInspectionPnTransporterService
      .getSingleTransporter(id)
      .subscribe((data) => {
        if (data && data.success) {
          this.selectedTransporter = data.model;
        }
      });
  }

  editTransporter() {
    this.trashInspectionPnTransporterService
      .updateTransporter(this.selectedTransporter)
      .subscribe((data) => {
        if (data && data.success) {
          this.transporterUpdated.emit();
          this.hide();
        }
      });
  }

  hide() {
    this.selectedTransporter = new ProducerPnModel();
    this.dialogRef.close();
  }
}
