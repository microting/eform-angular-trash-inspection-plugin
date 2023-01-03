import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {TrashInspectionsRouting} from './trash-inspections.routing';
import {
  // TrashInspectionCreateComponent,
  // TrashInspectionEditComponent,
  TrashInspectionsPageComponent,
  TrashInspectionVersionViewComponent,
} from './components';
import {SharedPnModule} from 'src/app/plugins/modules/shared/shared-pn.module';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {trashInspectionPersistProvider, TrashInspectionsStateService} from './components/store';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    SharedPnModule,
    MDBBootstrapModule,
    TrashInspectionsRouting,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    EformSharedModule,
    FontAwesomeModule,
    NgxChartsModule,
    MtxGridModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  declarations: [
    // TrashInspectionCreateComponent,
    // TrashInspectionEditComponent,
    TrashInspectionsPageComponent,
    TrashInspectionVersionViewComponent,
  ],
  providers: [
    trashInspectionPersistProvider,
    TrashInspectionsStateService,
  ],
})
export class TrashInspectionsModule {
}
