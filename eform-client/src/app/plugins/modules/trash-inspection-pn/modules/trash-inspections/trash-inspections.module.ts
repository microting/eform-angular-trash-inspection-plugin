import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {TrashInspectionsRouting} from './trash-inspections.routing';
import {
  // TrashInspectionCreateComponent,
  // TrashInspectionEditComponent,
  TrashInspectionsPageComponent,
  TrashInspectionVersionViewComponent,
} from './components';
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
    TrashInspectionsRouting,
    TranslateModule,
    FormsModule,
    EformSharedModule,
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
