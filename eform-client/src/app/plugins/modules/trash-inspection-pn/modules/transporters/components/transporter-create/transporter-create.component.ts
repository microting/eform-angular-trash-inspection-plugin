import {
  Component,
  EventEmitter,
  OnInit,
} from '@angular/core';
import {TransporterPnModel} from '../../../../models';
import {TrashInspectionPnTransporterService} from '../../../../services';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-trash-inspection-pn-transporter-create',
  templateUrl: './transporter-create.component.html',
  styleUrls: ['./transporter-create.component.scss'],
  standalone: false
})
export class TransporterCreateComponent implements OnInit {
  transporterCreated: EventEmitter<void> = new EventEmitter<void>();
  newTransporterModel: TransporterPnModel = new TransporterPnModel();

  constructor(
    private trashInspectionPnTransporterService: TrashInspectionPnTransporterService,
    public dialogRef: MatDialogRef<TransporterCreateComponent>,
  ) {
  }

  ngOnInit() {
  }

  createTransporter() {
    this.trashInspectionPnTransporterService
      .createTransporter(this.newTransporterModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.transporterCreated.emit();
          this.hide();
        }
      });
  }

  hide() {
    this.newTransporterModel = new TransporterPnModel();
    this.dialogRef.close();
  }
}
