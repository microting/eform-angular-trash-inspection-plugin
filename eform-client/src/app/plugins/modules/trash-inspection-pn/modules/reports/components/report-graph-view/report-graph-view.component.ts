import {Component, Inject, OnInit,} from '@angular/core';
import {
  TrashInspectionPnFractionsService,
  TrashInspectionPnProducersService,
  TrashInspectionPnTransporterService,
} from '../../../../services';
import {
  FractionPnStatsByYearModel,
  ProducerPnStatsByYearModel,
  TransporterPnStatsByYearModel
} from '../../../../models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LegendPosition, Color} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-report-graph-view',
  templateUrl: './report-graph-view.component.html',
  styleUrls: ['./report-graph-view.component.scss'],
})
export class ReportGraphViewComponent implements OnInit {
  // series1 = [
  //   {
  //     name: 'jan',
  //     series: [
  //       {
  //         name: 'Antal Læs',
  //         value: 5,
  //       },
  //       {
  //         name: 'Antal Læs Kontrolleret',
  //         value: 5,
  //       },
  //     ],
  //   },
  //   {
  //     name: 'feb',
  //     series: [
  //       {
  //         name: 'Antal Læs',
  //         value: 10,
  //       },
  //       {
  //         name: 'Antal Læs Kontrolleret',
  //         value: 2,
  //       },
  //     ],
  //   },
  //   {
  //     name: 'mar',
  //     series: [
  //       {
  //         name: 'Antal Læs',
  //         value: 4,
  //       },
  //       {
  //         name: 'Antal Læs Kontrolleret',
  //         value: 1,
  //       },
  //     ],
  //   },
  //   {
  //     name: 'apr',
  //     series: [
  //       {
  //         name: 'Antal Læs',
  //         value: 35,
  //       },
  //       {
  //         name: 'Antal Læs Kontrolleret',
  //         value: 0,
  //       },
  //     ],
  //   },
  //   {
  //     name: 'maj',
  //     series: [
  //       {
  //         name: 'Antal Læs',
  //         value: 44,
  //       },
  //       {
  //         name: 'Antal Læs Kontrolleret',
  //         value: 5,
  //       },
  //     ],
  //   },
  //   {
  //     name: 'jun',
  //     series: [
  //       {
  //         name: 'Antal Læs',
  //         value: 9,
  //       },
  //       {
  //         name: 'Antal Læs Kontrolleret',
  //         value: 1,
  //       },
  //     ],
  //   },
  //   {
  //     name: 'jul',
  //     series: [
  //       {
  //         name: 'Antal Læs',
  //         value: 40,
  //       },
  //       {
  //         name: 'Antal Læs Kontrolleret',
  //         value: 30,
  //       },
  //     ],
  //   },
  //   {
  //     name: 'aug',
  //     series: [
  //       {
  //         name: 'Antal Læs',
  //         value: 90,
  //       },
  //       {
  //         name: 'Antal Læs Kontrolleret',
  //         value: 33,
  //       },
  //     ],
  //   },
  //   {
  //     name: 'sep',
  //     series: [
  //       {
  //         name: 'Antal Læs',
  //         value: 100,
  //       },
  //       {
  //         name: 'Antal Læs Kontrolleret',
  //         value: 99,
  //       },
  //     ],
  //   },
  //   {
  //     name: 'okt',
  //     series: [
  //       {
  //         name: 'Antal Læs',
  //         value: 1,
  //       },
  //       {
  //         name: 'Antal Læs Kontrolleret',
  //         value: 0,
  //       },
  //     ],
  //   },
  //   {
  //     name: 'nov',
  //     series: [
  //       {
  //         name: 'Antal Læs',
  //         value: 55,
  //       },
  //       {
  //         name: 'Antal Læs Kontrolleret',
  //         value: 30,
  //       },
  //     ],
  //   },
  //   {
  //     name: 'dec',
  //     series: [
  //       {
  //         name: 'Antal Læs',
  //         value: 2,
  //       },
  //       {
  //         name: 'Antal Læs Kontrolleret',
  //         value: 0,
  //       },
  //     ],
  //   },
  // ];
  data1 = [];
  data2 = [];
  transporterName: string;
  producerName: string;
  fractionName: string;
  view: any[] = [900, 450];
  // options for the chart
  // showGridLines = true;
  // gradient = false;
  animations = true;
  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Months';
  showYAxisLabel = true;
  yAxisLabel = '%';
  yScaleMax = 100;
  legendPosition = LegendPosition.Below;
  legendTitle = '';
  colorScheme: Color = {
    group: undefined, name: '', selectable: false,
    domain: ['#0004ff', '#FF7800', '#a9a9a9', '#FF7F50', '#90EE90', '#FFB600']
  };
  // lineChartScheme = {
  //   name: 'coolthree',
  //   selectable: true,
  //   group: 'ordinal',
  //   domain: ['#01579b', '#7aa3e5', '#a8385d', '#00bfa5'],
  // };
  // comboBarScheme = {
  //   selectable: true,
  //   name: 'singleLightBlue',
  //   group: 'ordinal',
  //   domain: ['#01579b', '#7aa3e5', '#a8385d', '#00bfa5'],
  // };
  constructor(
    private trashInspectionPnTransporterService: TrashInspectionPnTransporterService,
    private trashInspectionPnProducerService: TrashInspectionPnProducersService,
    private trashInspectionPnFractionService: TrashInspectionPnFractionsService,
    public dialogRef: MatDialogRef<ReportGraphViewComponent>,
    @Inject(MAT_DIALOG_DATA) model: {
      model: FractionPnStatsByYearModel | ProducerPnStatsByYearModel | TransporterPnStatsByYearModel,
      selectedYear: number,
      selectedView: string
    }
  ) {
    if (model.selectedView === 'Transporters') {
      this.getSelectedTransporter(model.model.id, model.selectedYear);
      this.transporterName = model.model.name;
    }
    if (model.selectedView === 'Producers') {
      this.getSelectedProducer(model.model.id, model.selectedYear);
      this.producerName = model.model.name;
    }
    if (model.selectedView === 'Fractions') {
      this.getSelectedFraction(model.model.id, model.selectedYear);
      this.fractionName = model.model.name;
    }
  }

  ngOnInit() {
  }

  getSelectedTransporter(id: number, year: number) {
    this.trashInspectionPnTransporterService
      .getSingleTransporterByMonth(id, year)
      .subscribe((data) => {
        if (data && data.success) {
          this.data1 = data.model.statByMonthListData1;
          this.data2 = data.model.statByMonthListData2;
        }
      });
  }

  getSelectedProducer(id: number, year: number) {
    this.trashInspectionPnProducerService
      .getSingleProducerByMonth(id, year)
      .subscribe((data) => {
        if (data && data.success) {
          this.data1 = data.model.statByMonthListData1;
          this.data2 = data.model.statByMonthListData2;
        }
      });
  }

  getSelectedFraction(id: number, year: number) {
    this.trashInspectionPnFractionService
      .getSingleFractionByMonth(id, year)
      .subscribe((data) => {
        if (data && data.success) {
          this.data1 = data.model.statByMonthListData1;
          this.data2 = data.model.statByMonthListData2;
        }
      });
  }

  hide() {
    this.dialogRef.close();
  }
}
