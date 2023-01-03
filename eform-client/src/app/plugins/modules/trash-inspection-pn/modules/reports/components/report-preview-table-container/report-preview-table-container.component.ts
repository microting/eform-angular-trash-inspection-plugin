import {Component, OnInit, ViewChild} from '@angular/core';
import {PageSettingsModel} from 'src/app/common/models';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {ReportGraphViewComponent} from '../';
import {
  FractionPnStatsByYearModel,
  ProducerPnStatsByYearModel,
  TransporterPnStatsByYearModel
} from '../../../../models';

@Component({
  selector: 'app-report-preview-table',
  templateUrl: './report-preview-table-container.component.html',
  styleUrls: ['./report-preview-table-container.component.scss'],
})
export class ReportPreviewTableContainerComponent implements OnInit {
  @ViewChild('reportGraphViewModal') reportGraphViewModal;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  selectedYear = new Date().getFullYear();
  years: number[] = [];
  viewNames = ['Fractions', 'Producers', 'Transporters'];
  selectedView: 'Fractions' | 'Producers' | 'Transporters';

  get subtitle(): string {
    switch (this.selectedView) {
      case 'Fractions':
        return `Trash/Deponi - ${this.selectedYear} - Compliance - Items`;
      case 'Producers':
        return `Trash/Deponi - ${this.selectedYear} - Compliance - Producers`;
      case 'Transporters':
        return `Trash/Deponi - ${this.selectedYear} - Compliance - Transporters`;
      default:
        return '';
    }
  }

  constructor(
    private dialog: MatDialog,
    private overlay: Overlay,
  ) {
  }

  ngOnInit() {
    this.fillYears();
  }

  fillYears() {
    for (let i = 2019; i <= this.selectedYear; i++) {
      this.years = [...this.years, i];
    }
    return this.years;
  }

  showGraphModal(model: FractionPnStatsByYearModel | ProducerPnStatsByYearModel | TransporterPnStatsByYearModel) {
    // const reportGraphViewModal =
      this.dialog.open(ReportGraphViewComponent, {...dialogConfigHelper(this.overlay,
          {model: model, selectedYear: this.selectedYear, selectedView: this.selectedView}),
        minWidth: 400});
  }

  onSelectedViewChanged(selectedView: 'Fractions' | 'Producers' | 'Transporters') {
    this.selectedView = selectedView;
  }
}
