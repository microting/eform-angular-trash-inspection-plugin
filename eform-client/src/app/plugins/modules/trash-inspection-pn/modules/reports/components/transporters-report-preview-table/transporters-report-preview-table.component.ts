import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {TransporterPnStatsByYearModel} from '../../../../models';
import {Paged} from 'src/app/common/models';
import {TransportersReportPreviewTableStateService} from './store';
import {Sort} from '@angular/material/sort';
import {TranslateService} from '@ngx-translate/core';
import {MtxGridColumn} from '@ng-matero/extensions/grid';

@Component({
  selector: 'app-transporters-report-preview-table',
  templateUrl: './transporters-report-preview-table.component.html',
  styleUrls: ['./transporters-report-preview-table.component.scss'],
})
export class TransportersReportPreviewTableComponent
  implements OnInit, OnChanges {
  @Input() thisYear: number;
  @Output()
  onShowGraphModal: EventEmitter<TransporterPnStatsByYearModel> = new EventEmitter<TransporterPnStatsByYearModel>();
  transporterYearModel: Paged<TransporterPnStatsByYearModel> = new Paged<TransporterPnStatsByYearModel>();

  tableHeaders: MtxGridColumn[] = [
    {
      header: this.translateService.stream('Transporter'),
      field: 'name',
      sortProp: {id: 'Name'},
      sortable: true,
    },
    {header: this.translateService.stream('Amount of load'), field: 'weighings', sortProp: {id: 'Weighings'}, sortable: true},
    {header: this.translateService.stream('Amount of load controlled'), field: 'amountOfWeighingsControlled', sortProp: {id: 'AmountOfWeighingsControlled'}, sortable: true},
    {header: this.translateService.stream('Controlled percentage'), field: 'controlPercentage', sortProp: {id: 'ControlPercentage'}, sortable: true, type: 'percent'},
    {header: this.translateService.stream('Approved percentage'), field: 'approvedPercentage', sortProp: {id: 'ApprovedPercentage'}, sortable: true, type: 'percent'},
    {header: this.translateService.stream('Conditional approved percentage'), field: 'conditionalApprovedPercentage', sortProp: {id: 'ConditionalApprovedPercentage'}, sortable: true, type: 'percent'},
    {header: this.translateService.stream('Not approved percentage'), field: 'notApprovedPercentage', sortProp: {id: 'NotApprovedPercentage'}, sortable: true, type: 'percent'},
  ];

  constructor(
    public transportersReportPreviewTableStateService: TransportersReportPreviewTableStateService,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.getAllInitialDataTransporters();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.thisYear.firstChange) {
      this.transportersReportPreviewTableStateService.updateYear(this.thisYear);
      this.getAllTransportersByYear();
    }
  }

  getAllInitialDataTransporters() {
    this.transportersReportPreviewTableStateService.updateYear(this.thisYear);
    this.getAllTransportersByYear();
  }

  getAllTransportersByYear() {
    this.transportersReportPreviewTableStateService
      .getAllTransportersByYear()
      .subscribe((data) => {
        if (data && data.success) {
          this.transporterYearModel = data.model;
        }
      });
  }

  sortTableTransporters(sort: Sort) {
    this.transportersReportPreviewTableStateService.onSortTable(sort.active);
    this.getAllTransportersByYear();
  }

  showGraphModal(transporter: TransporterPnStatsByYearModel) {
    this.onShowGraphModal.emit(transporter);
  }
}
