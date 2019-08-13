import {Component, OnInit, ViewChild} from '@angular/core';
import {PageSettingsModel} from '../../../../../../common/models/settings';
import {TransporterPnModel, TransporterPnRequestModel, TransportersPnModel} from '../../../models/transporter';
import {SharedPnService} from '../../../../shared/services';
import {TrashInspectionPnTransporterService} from '../../../services';

@Component({
  selector: 'app-transporter-page',
  templateUrl: './transporter-page.component.html',
  styleUrls: ['./transporter-page.component.scss']
})
export class TransporterPageComponent implements OnInit {
  @ViewChild('createTransporterModal') createTransporterModal;
  @ViewChild('editTransporterModal') editTransporterModal;
  @ViewChild('deleteTransporterModal') deleteTransporterModal;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  spinnerStatus = false;
  transportersModel: TransportersPnModel = new TransportersPnModel();
  transporterRequestModel: TransporterPnRequestModel = new TransporterPnRequestModel();
  columnNames = ['Loads', 'Approved', 'Partial', 'Not approved'];
  columnNames2 = ['Loads', 'Approved', 'Partial', 'Not approved', 'kontrol%', 'GnsKontrol%'];
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
  options = {
    width: 800,
    height: 700,
    chart: {
      title: 'Transporter',
      subtitle: 'Læs: godkendt, delvist godkendt, ikke godkendt'
    },
    vAxis: {
     title: '%',
    format: 'percent'
    },
    hAxis: {
     title: 'Months'
    },
    legend: {position: 'bottom'}
  };
  options2 = {
    width: 800,
    height: 700,
    chart: {
      title: 'Transporter',
      subtitle: 'Læs: godkendt, delvist godkendt, ikke godkendt'
    },
    vAxis: {
      title: '%',
      format: 'percent'
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
  constructor(private sharedPnService: SharedPnService,
              private trashInspectionPnTransporterService: TrashInspectionPnTransporterService) { }

  ngOnInit() {
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.sharedPnService.getLocalPageSettings
    ('trashInspectionsPnSettings', 'Transporters').settings;
    this.getAllInitialData();
  }
  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings
    ('trashInspectionsPnSettings', this.localPageSettings, 'Transporters');
    this.getAllTransporters();
  }
  getAllInitialData() {
    this.getAllTransporters();
  }

  getAllTransporters() {
    this.spinnerStatus = true;
    this.transporterRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.transporterRequestModel.sort = this.localPageSettings.sort;
    this.transporterRequestModel.pageSize = this.localPageSettings.pageSize;
    this.trashInspectionPnTransporterService.getAllTransporters(this.transporterRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.transportersModel = data.model;
      } this.spinnerStatus = false;
    });
  }
  showCreateTransporterModal() {
    this.createTransporterModal.show();
  }
  showEditTransporterModal(transporter: TransporterPnModel) {
    this.editTransporterModal.show(transporter);
  }
  showDeleteTransporterModal(transporter: TransporterPnModel) {
    this.deleteTransporterModal.show(transporter);
  }
  sortTable(sort: string) {
    if (this.localPageSettings.sort === sort) {
      this.localPageSettings.isSortDsc = !this.localPageSettings.isSortDsc;
    } else {
      this.localPageSettings.isSortDsc = false;
      this.localPageSettings.sort = sort;
    }
    this.updateLocalPageSettings();
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.transporterRequestModel.offset = e;
      if (e === 0) {
        this.transporterRequestModel.pageIndex = 0;
      } else {
        this.transporterRequestModel.pageIndex
          = Math.floor(e / this.transporterRequestModel.pageSize);
      }
      this.getAllTransporters();
    }
  }
}
