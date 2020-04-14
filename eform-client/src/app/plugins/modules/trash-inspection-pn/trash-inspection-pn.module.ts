import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {NgSelectModule} from '@ng-select/ng-select';

import {
  TrashInspectionPnFractionsService,
  TrashInspectionPnInstallationsService,
  TrashInspectionPnTrashInspectionsService,
  TrashInspectionPnSettingsService,
  TrashInspectionPnTransporterService,
  TrashInspectionPnProducersService,
  TrashInspectionPnSegmentsService
} from './services';
import {TrashInspectionPnLayoutComponent} from './layouts';
import {TrashInspectionPnRouting} from './trash-inspection-pn.routing.module';
import {SharedPnModule} from '../shared/shared-pn.module';
// import {StatusBarComponent} from '../../../common/modules/eform-shared/components';
import {EformSharedModule} from '../../../common/modules/eform-shared/eform-shared.module';

import {
  FractionCreateComponent,
  FractionDeleteComponent,
  FractionEditComponent,
  FractionsPageComponent,
  FractionsPnImportComponent,
  InstallationCreateComponent,
  InstallationDeleteComponent,
  InstallationsPageComponent,
  InstallationEditComponent,
  TrashInspectionCreateComponent,
  TrashInspectionDeleteComponent,
  TrashInspectionsPageComponent,
  TrashInspectionEditComponent,
  TrashInspectionSettingsComponent,
  TrashInspectionVersionViewComponent,
  SegmentCreateComponent,
  SegmentDeleteComponent,
  SegmentEditComponent,
  SegmentsPageComponent,
  ProducerPageComponent,
  ProducerCreateComponent,
  ProducerDeleteComponent,
  ProducerEditComponent,
  ProducerImportComponent,
  TransporterPageComponent,
  TransporterCreateComponent,
  TransporterDeleteComponent,
  TransporterEditComponent,
  TransporterImportComponent,
  ReportPreviewTableComponent,
  ReportGraphViewComponent
} from './components';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {MDBBootstrapModule} from 'angular-bootstrap-md';

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
    NgxChartsModule
  ],
  declarations: [
    InstallationsPageComponent,
    InstallationDeleteComponent,
    InstallationCreateComponent,
    InstallationEditComponent,
    TrashInspectionsPageComponent,
    TrashInspectionCreateComponent,
    TrashInspectionEditComponent,
    TrashInspectionDeleteComponent,
    TrashInspectionPnLayoutComponent,
    TrashInspectionSettingsComponent,
    TrashInspectionVersionViewComponent,
    FractionCreateComponent,
    FractionDeleteComponent,
    FractionEditComponent,
    FractionsPnImportComponent,
    FractionsPageComponent,
    SegmentCreateComponent,
    SegmentDeleteComponent,
    SegmentEditComponent,
    SegmentsPageComponent,
    ProducerPageComponent,
    ProducerCreateComponent,
    ProducerDeleteComponent,
    ProducerEditComponent,
    ProducerImportComponent,
    TransporterPageComponent,
    TransporterCreateComponent,
    TransporterDeleteComponent,
    TransporterEditComponent,
    TransporterImportComponent,
    ReportPreviewTableComponent,
    ReportGraphViewComponent
  ],
  providers: [TrashInspectionPnFractionsService,
              TrashInspectionPnInstallationsService,
              TrashInspectionPnTrashInspectionsService,
              TrashInspectionPnSegmentsService,
              TrashInspectionPnSettingsService,
              TrashInspectionPnTransporterService,
              TrashInspectionPnProducersService
  ]
})
export class TrashInspectionPnModule { }
