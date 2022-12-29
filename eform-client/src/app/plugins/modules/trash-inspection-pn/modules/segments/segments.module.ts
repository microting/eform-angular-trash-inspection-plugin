import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {SegmentsRouting} from './segments.routing';
import {
  SegmentCreateComponent,
  SegmentEditComponent,
  SegmentsPageComponent,
} from './components';
import {SharedPnModule} from 'src/app/plugins/modules/shared/shared-pn.module';
import {segmentsPersistProvider} from './components/store';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    SharedPnModule,
    SegmentsRouting,
    TranslateModule,
    FormsModule,
    EformSharedModule,
    MatTooltipModule,
    MatButtonModule,
    MtxGridModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [
    SegmentCreateComponent,
    SegmentEditComponent,
    SegmentsPageComponent,
  ],
  providers: [
    segmentsPersistProvider,
  ],
})
export class SegmentsModule {
}
