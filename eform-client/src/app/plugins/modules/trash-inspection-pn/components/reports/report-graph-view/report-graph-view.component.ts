import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-report-graph-view',
  templateUrl: './report-graph-view.component.html',
  styleUrls: ['./report-graph-view.component.scss']
})
export class ReportGraphViewComponent implements OnInit {
@ViewChild('frame') frame;
  columnNames = ['Loads', 'Approved', 'Partial', 'Not approved'];
  columnNames2 = ['Loads', 'Approved', 'Partial', 'Not approved', 'kontrol%', 'GnsKontrol%'];
  columnNames3 = ['Loads', 'compliance %'];
  data = [
    ['Jan', 8.8, 1.0, 0.2],
    ['Feb', 5.0, 4.5, 0.5],
    ['Mar', 6.5, 3.0, 0.5],
    ['Apr', 0.2, 9.8, 0],
    ['Maj', 2.2, 5.5, 2.3],
    ['Jun', 3.5, 5.5, 1.0],
    ['Jul', 4.4, 5.6, 0],
    ['Aug', 5.0, 3.0, 2.0],
    ['Sep', 10, 0, 0],
    ['Okt', 6.2, 6.2, 0],
    ['Nov', 4.8, 5.2, 0],
    ['Dec', 5.5, 4.5, 0]
  ];
  data2 = [
    ['Jan', 8.8, 1.0, 0.2, 10, 2],
    ['Feb', 5.0, 4.5, 0.5, 8, 2],
    ['Mar', 6.5, 3.0, 0.5, 7, 2],
    ['Apr', 0.2, 9.8, 0, 10, 2],
    ['Maj', 2.2, 5.5, 2.3, 2, 2],
    ['Jun', 3.5, 5.5, 1.0, 10, 2],
    ['Jul', 4.4, 5.6, 0, 10, 2],
    ['Aug', 5.0, 3.0, 2.0, 10, 2],
    ['Sep', 10, 0, 0, 10, 2],
    ['Okt', 6.2, 6.2, 0, 10, 2],
    ['Nov', 4.8, 5.2, 0, 10, 2],
    ['Dec', 5.5, 4.5, 0, 10, 2]
  ];
  data3 = [
    ['Jan', 8.8],
    ['Feb', 5.0],
    ['Mar', 6.5],
    ['Apr', 0.2],
    ['Maj', 2.2],
    ['Jun', 3.5],
    ['Jul', 4.4],
    ['Aug', 5.0],
    ['Sep', 10],
    ['Okt', 6.2],
    ['Nov', 4.8],
    ['Dec', 5.5]
  ];
  options = {
    width: 1500,
    height: 700,
    chart: {
      title: 'Transporter',
      subtitle: 'Læs: godkendt, delvist godkendt, ikke godkendt'
    },
    vAxis: {
      title: '%'
    },
    hAxis: {
      title: 'Months'
    },
    legend: {position: 'bottom'}
  };
  options2 = {
    width: 1500,
    height: 700,
    chart: {
      title: 'Transporter',
      subtitle: 'Læs: godkendt, delvist godkendt, ikke godkendt'
    },
    vAxis: {
      title: '%'
    },
    hAxis: {
      title: 'Months'
    },
    seriesType: 'bars',
    series: {
      3: {type: 'line'},
      4: {type: 'line'}
    },
    legend: {position: 'bottom'}
  };

  constructor() { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

}
