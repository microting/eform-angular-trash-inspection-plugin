import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {InstallationsRouting} from './installations.routing';
import {
  InstallationCreateComponent,
  InstallationsPageComponent,
  InstallationEditComponent,
} from './components';
import {installationsPersistProvider, InstallationsStateService} from './components/store';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  imports: [
    CommonModule,
    InstallationsRouting,
    TranslateModule,
    FormsModule,
    EformSharedModule,
    MatButtonModule,
    MatTooltipModule,
    MtxGridModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  declarations: [
    InstallationCreateComponent,
    InstallationsPageComponent,
    InstallationEditComponent,
  ],
  providers: [
    installationsPersistProvider,
    InstallationsStateService,
  ],
})
export class InstallationsModule {
}
