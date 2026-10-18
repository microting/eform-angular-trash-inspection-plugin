import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {FractionsRouting} from './fractions.routing';
import {
  FractionCreateComponent,
  FractionEditComponent,
  FractionsPageComponent,
  FractionsImportComponent,
} from './components';

@NgModule({
  imports: [
    FractionsRouting,
    MatDialogModule,
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
