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
import {ProducerPnModel,} from '../../../../models';
import {TrashInspectionPnProducersService} from '../../../../services';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-trash-inspection-pn-producer-create',
  templateUrl: './producer-create.component.html',
  styleUrls: ['./producer-create.component.scss'],
  imports: [TranslatePipe, FormsModule, MatFormField, MatLabel, MatInput, MatButton, MatDialogTitle, MatDialogContent, MatDialogActions],
})
export class ProducerCreateComponent implements OnInit {
  private trashInspectionPnProducerService = inject(TrashInspectionPnProducersService);
  public dialogRef = inject(MatDialogRef<ProducerCreateComponent>);

  onProducerCreated: EventEmitter<void> = new EventEmitter<void>();
  newProducerModel: ProducerPnModel = new ProducerPnModel();

  

  ngOnInit() {
  }

  createProducer() {
    this.trashInspectionPnProducerService
      .createProducer(this.newProducerModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.onProducerCreated.emit();
          this.hide();
        }
      });
  }

  hide() {
    this.newProducerModel = new ProducerPnModel();
    this.dialogRef.close();
  }
}
