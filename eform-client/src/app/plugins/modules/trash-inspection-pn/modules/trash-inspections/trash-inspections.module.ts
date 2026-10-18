import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {TrashInspectionsRouting} from './trash-inspections.routing';
import {
  TrashInspectionsPageComponent,
  TrashInspectionVersionViewComponent,
} from './components';
import {TrashInspectionsStateService} from './components/store';

@NgModule({
  imports: [
    TrashInspectionsRouting,
    MatDialogModule,
    TrashInspectionsPageComponent,
    TrashInspectionVersionViewComponent,
  ],
  providers: [
    TrashInspectionsStateService,
  ],
})
export class TrashInspectionsModule {
}
