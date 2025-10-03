import {
  Component,
  EventEmitter,
  OnInit,
} from '@angular/core';
import {ProducerPnModel,} from '../../../../models';
import {TrashInspectionPnProducersService} from '../../../../services';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-trash-inspection-pn-producer-create',
  templateUrl: './producer-create.component.html',
  styleUrls: ['./producer-create.component.scss'],
  standalone: false
})
export class ProducerCreateComponent implements OnInit {
  onProducerCreated: EventEmitter<void> = new EventEmitter<void>();
  newProducerModel: ProducerPnModel = new ProducerPnModel();

  constructor(
    private trashInspectionPnProducerService: TrashInspectionPnProducersService,
    public dialogRef: MatDialogRef<ProducerCreateComponent>,
  ) {
  }

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
