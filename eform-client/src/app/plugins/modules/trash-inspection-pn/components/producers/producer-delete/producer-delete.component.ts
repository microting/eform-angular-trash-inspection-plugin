import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FractionPnModel} from '../../../models/fraction';
import {ProducerPnModel} from '../../../models/producer';
import {TrashInspectionPnProducersService} from '../../../services';

@Component({
  selector: 'app-trash-inspection-pn-producer-delete',
  templateUrl: './producer-delete.component.html',
  styleUrls: ['./producer-delete.component.scss']
})
export class ProducerDeleteComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onProducerDeleted: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  selectedProducerModel: ProducerPnModel = new ProducerPnModel();

  constructor(private trashInspectionPnProducerService: TrashInspectionPnProducersService) { }

  ngOnInit() {
  }

  show(producerModel: ProducerPnModel) {
    this.selectedProducerModel = producerModel;
    this.frame.show();
  }

  deleteProducer() {
    this.spinnerStatus = true;
    this.trashInspectionPnProducerService.deleteProducer(this.selectedProducerModel.id).subscribe((data) => {
      if (data && data.success) {
        this.onProducerDeleted.emit();
        this.frame.hide();
      } this.spinnerStatus = false;
    });  }
}
