import {Component, OnInit, ViewChild} from '@angular/core';
import {TransporterYearModel, TransporterYearPnModel} from '../../../models/transporter/transporterYearPnModel';
import {TrashInspectionPnTransporterService} from '../../../services';
import {TransporterMonthPnModel} from '../../../models/transporter/transporterMonthPnModel';
import {count} from 'rxjs/operators';

@Component({
  selector: 'app-report-graph-view',
  templateUrl: './report-graph-view.component.html',
  styleUrls: ['./report-graph-view.component.scss']
})
export class ReportGraphViewComponent implements OnInit {
@ViewChild('frame') frame;
  spinnerStatus = false;
  data1 = [];
  transporterName: string;
  columnNames = ['month', 'Loads', 'Weighings Controlled', 'Control%', 'Average Control%'];

  dataSource = {
    chart: {
      caption: 'Transportør',
      subCaption: 'Læs, godkendt og ikke godkendt',
      xAxisName: 'Måned',
      yAxisName: '%',
      yAxisMaxValue: 100,
      numberSuffix: '%',
      theme: 'fusion',
      exportEnabled: 1
    },
    categories: [{
      category: [{
        label: 'Jan'
      }, {
        label: 'Feb'
      }, {
        label: 'Mar'
      }, {
        label: 'Apr'
      }, {
        label: 'Maj'
      }, {
        label: 'Jun'
      }, {
        label: 'Jul'
      }, {
        label: 'Aug'
      }, {
        label: 'Sep'
      }, {
        label: 'Okt'
      }, {
        label: 'Nov'
      }, {
        label: 'Dec'
      }]
    }],
    dataset: [{
      seriesName: 'Godkendt %',
      data: [{
        value: 100
      }, {
        value: 100
      }, {
        value: 90
      }, {
        value: 92
      }, {
        value: 40
      }, {
        value: 98
      }, {
        value: 85
      }, {
        value: 35
      }, {
        value: 92
      }, {
        value: 81
      }, {
        value: 0
      }, {
        value: 48
      }]
    },
      {
      seriesName: 'Ikke Godkendt %',
      data: [{
        value: 0
      }, {
        value: 0
      }, {
        value: 10
      }, {
        value: 8
      }, {
        value: 60
      }, {
        value: 2
      }, {
        value: 15
      }, {
        value: 65
      }, {
        value: 8
      }, {
        value: 19
      }, {
        value: 100
      }, {
        value: 52
      }]
    }]
  };
  options = {
    width: 1500,
    height: 700,
    chart: {
      title: 'Transporter' ,
      subtitle: 'Læs: godkendt, delvist godkendt, ikke godkendt'
    },
    vAxis: {
      format: 'none',
      maxValue: 100,
      gridLines: count()
    },
    seriesType: 'bars',
    series: {
      2: {type: 'line', axis: 'Control%'},
      3: {type: 'line', axis: 'Average Control%'}
    }
  };


  constructor(private trashInspectionPnTransporterService: TrashInspectionPnTransporterService) {}

  ngOnInit() {
  }

  show(transporterModel: TransporterYearModel, year: number) {
    this.getSelectedTransporter(transporterModel.id, year);
    // this.frame.show();
    this.transporterName = transporterModel.name;
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
