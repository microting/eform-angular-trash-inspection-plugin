import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {FractionsRouting} from './fractions.routing';
import {
  FractionCreateComponent,
  FractionEditComponent,
  FractionsPageComponent,
  FractionsImportComponent,
} from './components';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FractionsRouting,
    TranslateModule,
    FormsModule,
    EformSharedModule,
    MtxGridModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MtxSelectModule,
    MatIconModule,
  ],
  declarations: [
    FractionCreateComponent,
    FractionEditComponent,
    FractionsPageComponent,
    FractionsImportComponent,
  ],
  providers: [
  ],
})
export class FractionsModule {
}
