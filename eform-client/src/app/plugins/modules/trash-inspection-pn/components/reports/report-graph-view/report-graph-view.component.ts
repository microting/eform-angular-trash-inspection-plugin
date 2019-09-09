import {Component, OnInit, ViewChild} from '@angular/core';
import {TransporterYearModel} from '../../../models/transporter/transporterYearPnModel';
import {TrashInspectionPnTransporterService} from '../../../services';

@Component({
  selector: 'app-report-graph-view',
  templateUrl: './report-graph-view.component.html',
  styleUrls: ['./report-graph-view.component.scss']
})
export class ReportGraphViewComponent implements OnInit {
  @ViewChild('frame') frame;
  series1 = [
    {
      name: 'Godkendt',
      series: [
        {
          name: 'Jan',
          value: 25
        },
        {
          name: 'Feb',
          value: 4
        },
        {
          name: 'Mar',
          value: 96
        },
        {
          name: 'Apr',
          value: 2
        },
        {
          name: 'Maj',
          value: 38
        },
        {
          name: 'Jun',
          value: 10
        },
        {
          name: 'Jul',
          value: 26
        },
        {
          name: 'Aug',
          value: 44
        },
        {
          name: 'Sep',
          value: 47
        },
        {
          name: 'Okt',
          value: 70
        },
        {
          name: 'Nov',
          value: 60
        },
        {
          name: 'Dec',
          value: 66
        }
      ]
    }
  ];
  spinnerStatus = false;
  data1 = [];
  data2 = [];
  transporterName: string;
  view: any[] = [900, 450];
  // options for the chart
  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Months';
  showYAxisLabel = true;
  yAxisLabel = '%';
  yScaleMax = 100;
  legendPosition = 'below';
  legendTitle = '';
  colorScheme = {
    domain: ['#0004ff', '#FF7800', '#a9a9a9', '#FF7F50', '#90EE90', '#FFB600']
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
        this.data2 = data.model.statByMonthListData2;
        this.frame.show();
      }
      this.spinnerStatus = false;
    });
  }


}
