import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {SegmentsRouting} from './segments.routing';
import {
  SegmentCreateComponent,
  SegmentDeleteComponent,
  SegmentEditComponent,
  SegmentsPageComponent,
} from './components';
import {SharedPnModule} from 'src/app/plugins/modules/shared/shared-pn.module';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {segmentsPersistProvider} from './components/store';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MtxGridModule} from '@ng-matero/extensions/grid';

@NgModule({
  imports: [
    CommonModule,
    SharedPnModule,
    MDBBootstrapModule,
    SegmentsRouting,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    EformSharedModule,
    FontAwesomeModule,
    NgxChartsModule,
    MatTooltipModule,
    MatButtonModule,
    MtxGridModule,
  ],
  declarations: [
    SegmentCreateComponent,
    SegmentDeleteComponent,
    SegmentEditComponent,
    SegmentsPageComponent,
  ],
  providers: [
    segmentsPersistProvider,
  ],
})
export class SegmentsModule {
}
