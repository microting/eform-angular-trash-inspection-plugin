import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ProducerPnModel} from '../../../models/producer';
import {TrashInspectionPnProducersService} from '../../../services';

@Component({
  selector: 'app-trash-inspection-pn-producer-edit',
  templateUrl: './producer-edit.component.html',
  styleUrls: ['./producer-edit.component.scss']
})
export class ProducerEditComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onProducerUpdated: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  selectedProducer: ProducerPnModel = new ProducerPnModel();
  constructor(private trashInspectionPnProducerService: TrashInspectionPnProducersService) { }

  ngOnInit() {
  }

  show(producerModel: ProducerPnModel) {
    this.getSelectedProducer(producerModel.id);
    this.frame.show();
  }

  getSelectedProducer(id: number) {
    this.spinnerStatus = false;
    this.trashInspectionPnProducerService.getSingleProducer(id).subscribe((data) => {
      if (data && data.success) {
        this.selectedProducer = data.model;
      } this.spinnerStatus = false;
    });
  }
  editProducer() {
    this.spinnerStatus = true;
    this.trashInspectionPnProducerService.updateProducer(this.selectedProducer).subscribe((data) => {
      if (data && data.success) {
        this.onProducerUpdated.emit();
        this.selectedProducer = new ProducerPnModel();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }

}
