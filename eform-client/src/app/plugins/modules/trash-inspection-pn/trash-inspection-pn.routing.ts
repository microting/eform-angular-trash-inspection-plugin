import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminGuard, PermissionGuard} from 'src/app/common/guards';
import {TrashInspectionPnLayoutComponent} from './layouts';
import {
  TrashInspectionSettingsComponent,
} from './components';
import {TrashInspectionPnClaims} from './enums';

export const routes: Routes = [
  {
    path: '',
    component: TrashInspectionPnLayoutComponent,
    canActivate: [PermissionGuard],
    data: { requiredPermission: TrashInspectionPnClaims.accessTrashInspectionPlugin, },
    children: [
      {
        path: 'fractions',
        loadChildren: () =>
          import('./modules/fractions/fractions.module').then(
            (m) => m.FractionsModule
          ),
      },
      {
        path: 'installations',
        loadChildren: () =>
          import('./modules/installations/installations.module').then(
            (m) => m.InstallationsModule
          ),
      },
      {
        path: 'producers',
        loadChildren: () =>
          import('./modules/producers/producers.module').then(
            (m) => m.ProducersModule
          ),
      },
      {
        path: 'segments',
        loadChildren: () =>
          import('./modules/segments/segments.module').then(
            (m) => m.SegmentsModule
          ),
      },
      {
        path: 'settings',
        canActivate: [AdminGuard],
        component: TrashInspectionSettingsComponent,
      },
      {
        path: 'transporters',
        loadChildren: () =>
          import('./modules/transporters/transporters.module').then(
            (m) => m.TransportersModule
          ),
      },
      {
        path: 'trash-inspections',
        loadChildren: () =>
          import('./modules/trash-inspections/trash-inspections.module').then(
            (m) => m.TrashInspectionsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrashInspectionPnRouting {}
