import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {FractionsRouting} from './fractions.routing';
import {
  FractionCreateComponent,
  FractionEditComponent,
  FractionsPageComponent,
  FractionsPnImportComponent,
} from './components';
import {SharedPnModule} from 'src/app/plugins/modules/shared/shared-pn.module';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {fractionsPersistProvider} from './components/store';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    SharedPnModule,
    MDBBootstrapModule,
    FractionsRouting,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    EformSharedModule,
    FontAwesomeModule,
    NgxChartsModule,
    MtxGridModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  declarations: [
    FractionCreateComponent,
    FractionEditComponent,
    FractionsPageComponent,
    FractionsPnImportComponent,
  ],
  providers: [
    fractionsPersistProvider,
  ],
})
export class FractionsModule {
}
