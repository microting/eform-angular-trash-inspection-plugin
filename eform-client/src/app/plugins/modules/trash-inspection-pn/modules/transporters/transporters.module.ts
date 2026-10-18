import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {TransportersRouting} from './transporters.routing';
import {
  TransporterImportComponent,
  TransporterPageComponent,
  TransporterCreateComponent,
  TransporterEditComponent,
} from './components';

@NgModule({
  imports: [
    TransportersRouting,
    MatDialogModule,
    TransporterImportComponent,
    TransporterPageComponent,
    TransporterCreateComponent,
    TransporterEditComponent,
  ],
  providers: [
  ],
})
export class TransportersModule {
}
