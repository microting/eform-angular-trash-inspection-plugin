import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {SegmentsRouting} from './segments.routing';
import {
  SegmentCreateComponent,
  SegmentEditComponent,
  SegmentsPageComponent,
} from './components';

@NgModule({
  imports: [
    SegmentsRouting,
    MatDialogModule,
    SegmentCreateComponent,
    SegmentEditComponent,
    SegmentsPageComponent,
  ],
  providers: [
  ],
})
export class SegmentsModule {
}
