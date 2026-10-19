import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {
  TrashInspectionPnSettingsService,
  TrashInspectionPnTrashInspectionsService,
  TrashInspectionPnSegmentsService,
  TrashInspectionPnFractionsService,
  TrashInspectionPnProducersService,
  TrashInspectionPnInstallationsService,
  TrashInspectionPnTransporterService,
} from './services';
import {TrashInspectionPnLayoutComponent} from './layouts';
import {TrashInspectionPnRouting} from './trash-inspection-pn.routing';
import {
  TrashInspectionSettingsComponent,
} from './components';
import {StoreModule} from '@ngrx/store';
import {
  fractionsReducer,
  installationsReducer,
  producersReducer,
  segmentsReducer,
  transportersReducer,
  trashInspectionsReducer
} from './state';

@NgModule({
  imports: [
    MatDialogModule,
    TrashInspectionPnRouting,
    StoreModule.forFeature('trashInspectionPn', {
      fractionsState: fractionsReducer,
      installationsState: installationsReducer,
      producersState: producersReducer,
      segmentsState: segmentsReducer,
      transportersState: transportersReducer,
      trashInspectionsState: trashInspectionsReducer
    }),
    TrashInspectionPnLayoutComponent,
    TrashInspectionSettingsComponent,
  ],
  providers: [
    TrashInspectionPnSettingsService,
    TrashInspectionPnTrashInspectionsService,
    TrashInspectionPnSegmentsService,
    TrashInspectionPnFractionsService,
    TrashInspectionPnProducersService,
    TrashInspectionPnInstallationsService,
    TrashInspectionPnTransporterService,
  ],
})
export class TrashInspectionPnModule {
}
