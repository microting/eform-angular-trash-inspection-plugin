import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
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
import {SharedPnModule} from 'src/app/plugins/modules/shared/shared-pn.module';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {fractionsReportPreviewTablePersistProvider} from './components/fractions-report-preview-table/store';
import {producersReportPreviewTablePersistProvider} from './components/producers-report-preview-table/store';
import {transportersReportPreviewTablePersistProvider} from './components/transporters-report-preview-table/store';

@NgModule({
  imports: [
    CommonModule,
    SharedPnModule,
    MDBBootstrapModule,
    ReportsRouting,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    EformSharedModule,
    FontAwesomeModule,
    NgxChartsModule,
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
