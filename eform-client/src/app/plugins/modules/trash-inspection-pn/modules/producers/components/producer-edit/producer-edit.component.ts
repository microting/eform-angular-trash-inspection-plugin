import {
  Component,
  EventEmitter,
  OnInit,
  inject
} from '@angular/core';
import { ProducerPnModel } from '../../../../models';
import { TrashInspectionPnProducersService } from '../../../../services';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-trash-inspection-pn-producer-edit',
  templateUrl: './producer-edit.component.html',
  styleUrls: ['./producer-edit.component.scss'],
  standalone: false
})
export class ProducerEditComponent implements OnInit {
  private trashInspectionPnProducerService = inject(TrashInspectionPnProducersService);
  public dialogRef = inject(MatDialogRef<ProducerEditComponent>);
  private producerModel = inject<ProducerPnModel>(MAT_DIALOG_DATA);

  onProducerUpdated: EventEmitter<void> = new EventEmitter<void>();
  selectedProducer: ProducerPnModel = new ProducerPnModel();
  

  ngOnInit() {
    this.getSelectedProducer(this.producerModel.id);
  }

  getSelectedProducer(id: number) {
    this.trashInspectionPnProducerService
      .getSingleProducer(id)
      .subscribe((data) => {
        if (data && data.success) {
          this.selectedProducer = data.model;
        }
      });
  }
  editProducer() {
    this.trashInspectionPnProducerService
      .updateProducer(this.selectedProducer)
      .subscribe((data) => {
        if (data && data.success) {
          this.onProducerUpdated.emit();
          this.hide();
        }
      });
  }

  hide() {
    this.selectedProducer = new ProducerPnModel();
    this.dialogRef.close();
  }
}
