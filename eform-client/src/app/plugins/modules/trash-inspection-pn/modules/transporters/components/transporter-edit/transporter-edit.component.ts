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
  standalone: false
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
