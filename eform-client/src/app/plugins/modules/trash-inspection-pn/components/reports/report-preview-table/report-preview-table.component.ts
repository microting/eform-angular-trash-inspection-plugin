import {ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {debounceTime, switchMap} from 'rxjs/operators';
import {TemplateListModel, TemplateRequestModel} from '../../../../../../common/models/eforms';
import {EFormService} from '../../../../../../common/services/eform';
import {PageSettingsModel} from '../../../../../../common/models/settings';
import {SharedPnService} from '../../../../shared/services';
import {
  TransporterPnModel,
  TransporterPnRequestModel,
  TransportersPnModel,
  TransporterYearPnRequestModel
} from '../../../models/transporter';
import {TrashInspectionPnFractionsService, TrashInspectionPnProducersService, TrashInspectionPnTransporterService} from '../../../services';
import {FractionPnModel, FractionPnRequestModel, FractionsPnModel} from '../../../models/fraction';
import {ProducerPnRequestModel, ProducersPnModel} from '../../../models/producer';
import {
  TrashInspectionYearModel,
  TrashInspectionYearModelPnModel
} from '../../../models/trash-inspection/trash-inspectionYearModel-pn.model';
import {ProducerYearPnModel} from '../../../models/producer/producerYearPnModel';
import {TransporterYearModel, TransporterYearPnModel} from '../../../models/transporter/transporterYearPnModel';
import {FractionYearPnModel} from '../../../models/fraction/fractionYearPnModel';

@Component({
  selector: 'app-report-preview-table',
  templateUrl: './report-preview-table.component.html',
  styleUrls: ['./report-preview-table.component.scss']
})
export class ReportPreviewTableComponent implements OnInit {
  @ViewChild('reportGraphViewModal') reportGraphViewModal;
  typeahead = new EventEmitter<string>();
  templatesModel: TemplateListModel = new TemplateListModel();
  templateRequestModel: TemplateRequestModel = new TemplateRequestModel();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  spinnerStatus = false;
  fractionsModel: FractionsPnModel = new FractionsPnModel();
  trashInspectionYearModel: TrashInspectionYearModelPnModel = new TrashInspectionYearModelPnModel();
  producerYearModel: ProducerYearPnModel = new ProducerYearPnModel();
  transporterYearModel: TransporterYearPnModel = new TransporterYearPnModel();
  fractionYearModel: FractionYearPnModel = new FractionYearPnModel();
  transporterRequestModel: TransporterPnRequestModel = new TransporterPnRequestModel();
  transporterYearRequestModel: TransporterYearPnRequestModel = new TransporterYearPnRequestModel();
  transportersModel: TransportersPnModel = new TransportersPnModel();
  fractionRequestModel: FractionPnRequestModel = new FractionPnRequestModel();
  producersModel: ProducersPnModel = new ProducersPnModel();
  producersRequestModel: ProducerPnRequestModel = new ProducerPnRequestModel();
  thisYear = new Date().getFullYear();
  years: number[] = [];
  fractions = [];

  constructor(private eFormService: EFormService, private cd: ChangeDetectorRef, private sharedPnService: SharedPnService,
              private trashInspectionPnTransporterService: TrashInspectionPnTransporterService,
              private trashInspectionPnFractionsService: TrashInspectionPnFractionsService,
              private trashInspectionPnProducerService: TrashInspectionPnProducersService) {
    this.typeahead
      .pipe(
        debounceTime(200),
        switchMap(term => {
          this.templateRequestModel.nameFilter = term;
          return this.eFormService.getAll(this.templateRequestModel);
        })
      )
      .subscribe(items => {
        this.templatesModel = items.model;
        this.cd.markForCheck();
      });
  }

  ngOnInit() {
    this.getAllYears();
  }



  getAllYears() {
    if (this.thisYear >= 2019) {
      for (let i = 2019; i <= this.thisYear; i++) {
        this.years.push(i);
      }
    }
    return this.years;
  }

  getLocalPageSettingsFractions() {
    this.localPageSettings = this.sharedPnService.getLocalPageSettings
      ('trashInspectionsPnSettings', 'FractionsByYear').settings;
    this.getAllInitialDataFractions();
  }

  updateLocalPageSettingsFractions() {
    this.sharedPnService.updateLocalPageSettings
    ('trashInspectionsPnSettings', this.localPageSettings, 'FractionsByYear');
    this.getAllInitialDataFractions();

  }

  getAllInitialDataFractions() {
    this.getAllFractions();
  }

  getAllFractions() {
    this.spinnerStatus = true;
    this.trashInspectionPnFractionsService.getAllFractionsStatsByYear(this.thisYear).subscribe((data) => {
      if (data && data.success) {
        this.fractionYearModel = data.model;
      } this.spinnerStatus = false;
      this.fractions = this.fractionsModel.fractionList;
    });
  }

  getLocalPageSettingsTransporters() {
    this.localPageSettings = this.sharedPnService.getLocalPageSettings
    ('trashInspectionsPnSettings', 'TransportersByYear').settings;
    this.getAllInitialDataTransporters();
  }

  updateLocalPageSettingsTransporters() {
    this.sharedPnService.updateLocalPageSettings
    ('trashInspectionsPnSettings', this.localPageSettings, 'TransportersByYear');
    this.getAllInitialDataFractions();
  }
  getAllInitialDataTransporters() {
    this.getAllTransportersByYear();
  }


  getAllTransportersByYear() {
    this.spinnerStatus = true;
    this.trashInspectionPnTransporterService.getAllTransportersByYear(this.transporterYearRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.transporterYearModel = data.model;
      } this.spinnerStatus = false;
    });
  }

  getLocalPageSettingsProducers() {
    this.localPageSettings = this.sharedPnService.getLocalPageSettings
    ('trashInspectionsPnSettings', 'ProducersByYear').settings;
    this.getAllInitialDataProducers();
  }
  updateLocalPageSettingsProducers() {
    this.sharedPnService.updateLocalPageSettings
    ('trashInspectionsPnSettings', this.localPageSettings, 'ProducersByYear');
    this.getAllInitialDataFractions();
  }

  getAllInitialDataProducers() {
    this.getAllProducers();
  }

  getAllProducers() {
    this.spinnerStatus = true;
    this.trashInspectionPnProducerService.getAllProducersStatsByYear(this.thisYear).subscribe((data) => {
      if (data && data.success) {
        this.producerYearModel = data.model;
      } this.spinnerStatus = false;
    });
  }

  onSelectedChanged(e: number) {
    this.thisYear = e;
    this.transporterYearRequestModel.year = e;
    this.getLocalPageSettingsProducers();
    this.getLocalPageSettingsTransporters();
    this.getLocalPageSettingsFractions();
  }

  showGraphModal(transporter: TransporterYearModel, year: number) {
    year = this.thisYear;
    this.reportGraphViewModal.show(transporter, year);
  }
  sortTableFracitons(sort: string) {
    if (this.localPageSettings.sort === sort) {
      this.localPageSettings.isSortDsc = !this.localPageSettings.isSortDsc;
    } else {
      this.localPageSettings.isSortDsc = false;
      this.localPageSettings.sort = sort;
    }
    this.updateLocalPageSettingsFractions();
  }
  sortTableTransporters(sort: string) {
    if (this.localPageSettings.sort === sort) {
      this.localPageSettings.isSortDsc = !this.localPageSettings.isSortDsc;
    } else {
      this.localPageSettings.isSortDsc = false;
      this.localPageSettings.sort = sort;
    }
    this.updateLocalPageSettingsTransporters();
  }
  sortTableProducers(sort: string) {
    if (this.localPageSettings.sort === sort) {
      this.localPageSettings.isSortDsc = !this.localPageSettings.isSortDsc;
    } else {
      this.localPageSettings.isSortDsc = false;
      this.localPageSettings.sort = sort;
    }
    this.updateLocalPageSettingsProducers();
  }

}
