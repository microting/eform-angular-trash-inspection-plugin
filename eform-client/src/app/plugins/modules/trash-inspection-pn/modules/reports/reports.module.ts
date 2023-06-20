import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {ReportsRouting} from './reports.routing';
import {
  FractionsReportPreviewTableComponent,
  ProducersReportPreviewTableComponent,
  ReportGraphViewComponent,
  ReportPreviewTableContainerComponent,
  TransportersReportPreviewTableComponent,
} from './components';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {fractionsReportPreviewTablePersistProvider} from './components/fractions-report-preview-table/store';
import {producersReportPreviewTablePersistProvider} from './components/producers-report-preview-table/store';
import {transportersReportPreviewTablePersistProvider} from './components/transporters-report-preview-table/store';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    ReportsRouting,
    TranslateModule,
    FormsModule,
    EformSharedModule,
    NgxChartsModule,
    MatFormFieldModule,
    MtxSelectModule,
    MtxGridModule,
    MatDialogModule,
    MatButtonModule,
  ],
  declarations: [
    FractionsReportPreviewTableComponent,
    ProducersReportPreviewTableComponent,
    ReportGraphViewComponent,
    ReportPreviewTableContainerComponent,
    TransportersReportPreviewTableComponent,
  ],
  providers: [
    fractionsReportPreviewTablePersistProvider,
    producersReportPreviewTablePersistProvider,
    transportersReportPreviewTablePersistProvider,
  ],
})
export class ReportsModule {
}
