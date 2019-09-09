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
    name: 'Jan',
    series: [
      {
        name: 'Godkendt',
        value: 20
      },
      {
        name: 'Betinget Godkendt',
        value: 50
      },
      {
        name: 'Ikke godkendt',
        value: 30
      }
    ]
  },
    {
      name: 'Feb',
      series: [
        {
          name: 'Godkendt',
          value: 0
        },
        {
          name: 'Betinget Godkendt',
          value: 0
        },
        {
          name: 'Ikke godkendt',
          value: 0
        }
      ]
    },
    {
      name: 'Mar',
      series: [
        {
          name: 'Godkendt',
          value: 0
        },
        {
          name: 'Betinget Godkendt',
          value: 0
        },
        {
          name: 'Ikke godkendt',
          value: 0
        }
      ]
    },
    {
      name: 'Apr',
      series: [
        {
          name: 'Godkendt',
          value: 0
        },
        {
          name: 'Betinget Godkendt',
          value: 0
        },
        {
          name: 'Ikke godkendt',
          value: 0
        }
      ]
    },
    {
      name: 'Maj',
      series: [
        {
          name: 'Godkendt',
          value: 10
        },
        {
          name: 'Betinget Godkendt',
          value: 0
        },
        {
          name: 'Ikke godkendt',
          value: 6
        }
      ]
    },
    {
      name: 'Jun',
      series: [
        {
          name: 'Godkendt',
          value: 10
        },
        {
          name: 'Betinget Godkendt',
          value: 0
        },
        {
          name: 'Ikke godkendt',
          value: 2
        }
      ]
    },
    {
      name: 'Jul',
      series: [
        {
          name: 'Godkendt',
          value: 0
        },
        {
          name: 'Betinget Godkendt',
          value: 0
        },
        {
          name: 'Ikke godkendt',
          value: 0
        }
      ]
    },
    {
      name: 'Aug',
      series: [
        {
          name: 'Godkendt',
          value: 0
        },
        {
          name: 'Betinget Godkendt',
          value: 0
        },
        {
          name: 'Ikke godkendt',
          value: 0
        }
      ]
    },
    {
      name: 'Sep',
      series: [
        {
          name: 'Godkendt',
          value: 0
        },
        {
          name: 'Betinget Godkendt',
          value: 0
        },
        {
          name: 'Ikke godkendt',
          value: 0
        }
      ]
    },
    {
      name: 'Okt',
      series: [
        {
          name: 'Godkendt',
          value: 0
        },
        {
          name: 'Betinget Godkendt',
          value: 0
        },
        {
          name: 'Ikke godkendt',
          value: 0
        }
      ]
    },
    {
      name: 'Nov',
      series: [
        {
          name: 'Godkendt',
          value: 0
        },
        {
          name: 'Betinget Godkendt',
          value: 0
        },
        {
          name: 'Ikke godkendt',
          value: 0
        }
      ]
    },
    {
      name: 'Dec',
      series: [
        {
          name: 'Godkendt',
          value: 0
        },
        {
          name: 'Betinget Godkendt',
          value: 0
        },
        {
          name: 'Ikke godkendt',
          value: 0
        }
      ]
    }
    ];
  spinnerStatus = false;
  data1 = [];
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
        this.frame.show();
      }
      this.spinnerStatus = false;
    });
  }


}
