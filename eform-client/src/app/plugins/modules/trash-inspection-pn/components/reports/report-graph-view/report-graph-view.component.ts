import {Component, OnInit, ViewChild} from '@angular/core';
import {TransporterYearModel, TransporterYearPnModel} from '../../../models/transporter/transporterYearPnModel';
import {TrashInspectionPnTransporterService} from '../../../services';
import {TransporterMonthPnModel} from '../../../models/transporter/transporterMonthPnModel';

@Component({
  selector: 'app-report-graph-view',
  templateUrl: './report-graph-view.component.html',
  styleUrls: ['./report-graph-view.component.scss']
})
export class ReportGraphViewComponent implements OnInit {
@ViewChild('frame') frame;
  spinnerStatus = false;
  data1 = [];
  columnNames = ['month', 'Loads', 'Weighings Controlled', 'Control%', 'Average Control%'];

  options = {
    width: 1500,
    height: 700,
    chart: {
      title: 'Transporter' ,
      subtitle: 'Læs: godkendt, delvist godkendt, ikke godkendt'
    },
    axes: {
      y: {
        ControlPercentage: {label: 'Control%'},
        AverageControlPercentage: {label: 'Average Control%'}
      }
    },
    seriesType: 'bars',
    series: {
      2: {type: 'line', axis: 'Control%'},
      3: {type: 'line', axis: 'Average Control%'}
    },
    legend: {position: 'bottom', alignment: 'start'}
  };


  constructor(private trashInspectionPnTransporterService: TrashInspectionPnTransporterService) { }

  ngOnInit() {
  }

  show(transporterModel: TransporterYearModel, year: number) {
    this.getSelectedTransporter(transporterModel.id, year);
    // this.frame.show();
  }

  getSelectedTransporter(id: number, year: number) {
    this.spinnerStatus = false;
    this.trashInspectionPnTransporterService.getSingleTransporterByMonth(id, year).subscribe((data) => {
      if (data && data.success) {
        this.data1 = data.model.statByMonthListData1;
        this.frame.show();
      }
      this.spinnerStatus = false;
    });
  }


}
