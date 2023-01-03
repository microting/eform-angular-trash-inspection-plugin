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
import {FractionPnStatsByYearModel} from '../../../../models';
import {FractionsReportPreviewTableStateService} from './store';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {Sort} from '@angular/material/sort';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-fractions-report-preview-table',
  templateUrl: './fractions-report-preview-table.component.html',
  styleUrls: ['./fractions-report-preview-table.component.scss'],
})
export class FractionsReportPreviewTableComponent implements OnInit, OnChanges {
  @Input() thisYear: number;
  @Output()
  onShowGraphModal: EventEmitter<FractionPnStatsByYearModel> = new EventEmitter<FractionPnStatsByYearModel>();
  fractionYearModel: Paged<FractionPnStatsByYearModel> = new Paged<FractionPnStatsByYearModel>();

  tableHeaders: MtxGridColumn[] = [
    {
      header: this.translateService.stream('Transporter'),
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
    public fractionsReportPreviewTableStateService: FractionsReportPreviewTableStateService,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit() {
    this.getAllInitialDataFractions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.thisYear.firstChange) {
      this.fractionsReportPreviewTableStateService.updateYear(this.thisYear);
      this.getAllFractions();
    }
  }

  getAllInitialDataFractions() {
    this.fractionsReportPreviewTableStateService.updateYear(this.thisYear);
    this.getAllFractions();
  }

  getAllFractions() {
    this.fractionsReportPreviewTableStateService
      .getAllFractionsStatsByYear()
      .subscribe((data) => {
        if (data && data.success) {
          this.fractionYearModel = data.model;
        }
      });
  }

  sortTableFractions(sort: Sort) {
    this.fractionsReportPreviewTableStateService.onSortTable(sort.active);
    this.getAllFractions();
  }

  showGraphModal(fraction: FractionPnStatsByYearModel) {
    this.onShowGraphModal.emit(fraction);
  }
}
