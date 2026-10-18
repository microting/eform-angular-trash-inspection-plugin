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
import {TransporterPnModel} from '../../../../models';
import {TrashInspectionPnTransporterService} from '../../../../services';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-trash-inspection-pn-transporter-create',
  templateUrl: './transporter-create.component.html',
  styleUrls: ['./transporter-create.component.scss'],
  imports: [TranslatePipe, FormsModule, MatFormField, MatLabel, MatInput, MatButton, MatDialogTitle, MatDialogContent, MatDialogActions],
})
export class TransporterCreateComponent implements OnInit {
  private trashInspectionPnTransporterService = inject(TrashInspectionPnTransporterService);
  public dialogRef = inject(MatDialogRef<TransporterCreateComponent>);

  transporterCreated: EventEmitter<void> = new EventEmitter<void>();
  newTransporterModel: TransporterPnModel = new TransporterPnModel();

  

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
