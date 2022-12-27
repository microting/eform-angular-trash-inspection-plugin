import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  TrashInspectionPnSettingsService,
  TrashInspectionPnTrashInspectionsService,
  TrashInspectionPnSegmentsService,
  TrashInspectionPnFractionsService,
  TrashInspectionPnProducersService,
  TrashInspectionPnInstallationsService,
  TrashInspectionPnTransporterService,
} from './services';
import { TrashInspectionPnLayoutComponent } from './layouts';
import { TrashInspectionPnRouting } from './trash-inspection-pn.routing';
import { SharedPnModule } from '../shared/shared-pn.module';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import {
  TrashInspectionSettingsComponent,
} from './components';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
  imports: [
    CommonModule,
    SharedPnModule,
    MDBBootstrapModule,
    TrashInspectionPnRouting,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    EformSharedModule,
    FontAwesomeModule,
    NgxChartsModule,
  ],
  declarations: [
    TrashInspectionPnLayoutComponent,
    TrashInspectionSettingsComponent,
  ],
  providers: [
    TrashInspectionPnSettingsService,
    TrashInspectionPnTrashInspectionsService,
    TrashInspectionPnSegmentsService,
    TrashInspectionPnFractionsService,
    TrashInspectionPnProducersService,
    TrashInspectionPnInstallationsService,
    TrashInspectionPnTransporterService,
  ],
})
export class TrashInspectionPnModule {}
