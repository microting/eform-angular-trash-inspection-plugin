import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {Paged} from 'src/app/common/models';
import {ProducerPnStatsByYearModel} from '../../../../models';
import {ProducersReportPreviewTableStateService} from './store';
import {Sort} from '@angular/material/sort';
import {TranslateService} from '@ngx-translate/core';
import {MtxGridColumn} from '@ng-matero/extensions/grid';

@Component({
  selector: 'app-producers-report-preview-table',
  templateUrl: './producers-report-preview-table.component.html',
  styleUrls: ['./producers-report-preview-table.component.scss'],
})
export class ProducersReportPreviewTableComponent implements OnInit, OnChanges {
  @Input() thisYear: number;
  @Output()
  onShowGraphModal: EventEmitter<ProducerPnStatsByYearModel> = new EventEmitter<ProducerPnStatsByYearModel>();
  producerYearModel: Paged<ProducerPnStatsByYearModel> = new Paged<ProducerPnStatsByYearModel>();

  tableHeaders: MtxGridColumn[] = [
    {
      header: this.translateService.stream('Producer'),
      field: 'name',
      sortProp: {id: 'Name'},
      sortable: true,
    },
    {header: this.translateService.stream('Amount of load'), field: 'weighings', sortProp: {id: 'Weighings'}, sortable: true},
    {
      header: this.translateService.stream('Amount of load controlled'),
      field: 'amountOfWeighingsControlled',
      sortProp: {id: 'AmountOfWeighingsControlled'},
      sortable: true
    },
    {
      header: this.translateService.stream('Controlled percentage'),
      field: 'controlPercentage',
      sortProp: {id: 'ControlPercentage'},
      sortable: true,
      type: 'percent'
    },
    {
      header: this.translateService.stream('Approved percentage'),
      field: 'approvedPercentage',
      sortProp: {id: 'ApprovedPercentage'},
      sortable: true,
      type: 'percent'
    },
    {
      header: this.translateService.stream('Conditional approved percentage'),
      field: 'conditionalApprovedPercentage',
      sortProp: {id: 'ConditionalApprovedPercentage'},
      sortable: true,
      type: 'percent'
    },
    {
      header: this.translateService.stream('Not approved percentage'),
      field: 'notApprovedPercentage',
      sortProp: {id: 'NotApprovedPercentage'},
      sortable: true,
      type: 'percent'
    },
  ];

  constructor(
    public producersReportPreviewTableStateService: ProducersReportPreviewTableStateService,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit() {
    this.getAllInitialDataProducers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.thisYear.firstChange) {
      this.producersReportPreviewTableStateService.updateYear(this.thisYear);
      this.getAllProducers();
    }
  }

  getAllInitialDataProducers() {
    this.producersReportPreviewTableStateService.updateYear(this.thisYear);
    this.getAllProducers();
  }

  getAllProducers() {
    this.producersReportPreviewTableStateService
      .getAllProducersStatsByYear()
      .subscribe((data) => {
        if (data && data.success) {
          this.producerYearModel = data.model;
        }
      });
  }

  showGraphModal(producer: ProducerPnStatsByYearModel) {
    this.onShowGraphModal.emit(producer);
  }

  sortTableProducers(sort: Sort) {
    this.producersReportPreviewTableStateService.onSortTable(sort.active);
    this.getAllProducers();
  }
}
