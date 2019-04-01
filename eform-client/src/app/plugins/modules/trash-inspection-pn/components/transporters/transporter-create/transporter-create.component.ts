import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {TransporterPnModel} from '../../../models/transporter';
import {TrashInspectionPnTransporterService} from '../../../services';
import {ProducerPnModel} from '../../../models/producer';

@Component({
  selector: 'app-trash-inspection-pn-transporter-create',
  templateUrl: './transporter-create.component.html',
  styleUrls: ['./transporter-create.component.scss']
})
export class TransporterCreateComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onProducerCreated: EventEmitter<void> = new EventEmitter<void>();
  @Output() onDeploymentFinished: EventEmitter<void> = new EventEmitter<void>();
  spinnerStatus = false;
  newTransporterModel: TransporterPnModel = new TransporterPnModel();
  constructor(private trashInspectionPnTransporterService: TrashInspectionPnTransporterService) { }

  ngOnInit() {
  }
  createTransporter() {
    this.spinnerStatus = true;
    this.trashInspectionPnTransporterService.createTransporter(this.newTransporterModel).subscribe((data) => {
      // debugger;
      if (data && data.success) {
        this.onProducerCreated.emit();
        // this.submitDeployment();
        this.newTransporterModel = new TransporterPnModel();
        this.frame.hide();
      } this.spinnerStatus = false;
    });
  }

  show() {
    this.frame.show();
  }
}
