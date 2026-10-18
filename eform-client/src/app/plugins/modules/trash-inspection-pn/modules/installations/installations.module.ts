import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {InstallationsRouting} from './installations.routing';
import {
  InstallationCreateComponent,
  InstallationsPageComponent,
  InstallationEditComponent,
} from './components';
import {InstallationsStateService} from './components/store';

@NgModule({
  imports: [
    InstallationsRouting,
    MatDialogModule,
    InstallationCreateComponent,
    InstallationsPageComponent,
    InstallationEditComponent,
  ],
  providers: [
    InstallationsStateService,
  ],
})
export class InstallationsModule {
}
