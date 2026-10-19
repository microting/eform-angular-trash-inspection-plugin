import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {ProducersRouting} from './producers.routing';
import {
  ProducerPageComponent,
  ProducerImportComponent,
  ProducerCreateComponent,
  ProducerEditComponent,
} from './components';

@NgModule({
  imports: [
    ProducersRouting,
    MatDialogModule,
    ProducerPageComponent,
    ProducerImportComponent,
    ProducerCreateComponent,
    ProducerEditComponent,
  ],
  providers: [
  ],
})
export class ProducersModule {
}
