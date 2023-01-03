import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {
  TrashInspectionPnSettingsService,
  TrashInspectionPnTrashInspectionsService,
  TrashInspectionPnSegmentsService,
  TrashInspectionPnFractionsService,
  TrashInspectionPnProducersService,
  TrashInspectionPnInstallationsService,
  TrashInspectionPnTransporterService,
} from './services';
import {TrashInspectionPnLayoutComponent} from './layouts';
import {TrashInspectionPnRouting} from './trash-inspection-pn.routing';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {
  TrashInspectionSettingsComponent,
} from './components';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MtxSelectModule} from '@ng-matero/extensions/select';

@NgModule({
  imports: [
    CommonModule,
    TrashInspectionPnRouting,
    TranslateModule,
    FormsModule,
    EformSharedModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MtxSelectModule,
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
export class TrashInspectionPnModule {
}
