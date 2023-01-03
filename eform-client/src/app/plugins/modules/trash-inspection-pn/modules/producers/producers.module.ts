import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {ProducersRouting} from './producers.routing';
import {
  ProducerPageComponent,
  ProducerImportComponent,
  ProducerCreateComponent,
  ProducerEditComponent,
} from './components';
import {producersPersistProvider} from './components/store';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    ProducersRouting,
    TranslateModule,
    FormsModule,
    EformSharedModule,
    MatButtonModule,
    MatTooltipModule,
    MtxGridModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MtxSelectModule,
    MatIconModule,
  ],
  declarations: [
    ProducerPageComponent,
    ProducerImportComponent,
    ProducerCreateComponent,
    ProducerEditComponent,
  ],
  providers: [
    producersPersistProvider,
  ],
})
export class ProducersModule {
}
