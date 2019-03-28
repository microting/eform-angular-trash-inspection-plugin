import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminGuard, AuthGuard} from 'src/app/common/guards';
import {TrashInspectionPnLayoutComponent} from './layouts';
import {
  TrashInspectionsPageComponent,
  InstallationsPageComponent,
  TrashInspectionSettingsComponent,
  FractionsPageComponent,
  FractionsPnImportComponent
} from './components';
import {SegmentsPageComponent} from './components/segments';

export const routes: Routes = [
  {
    path: '',
    component: TrashInspectionPnLayoutComponent,
    children: [
      {
        path: 'trash-inspections',
        canActivate: [AuthGuard],
        component: TrashInspectionsPageComponent
      },
      {
        path: 'installations',
        canActivate: [AdminGuard],
        component: InstallationsPageComponent
      },
      {
        path: 'settings',
        canActivate: [AdminGuard],
        component: TrashInspectionSettingsComponent
      },
      {
        path: 'fractions',
        canActivate: [AdminGuard],
        component: FractionsPageComponent
      },
      {
        path: 'segments',
        canActivate: [AdminGuard],
        component: SegmentsPageComponent
      },
      {
        path: 'importfraction',
        canActivate: [AdminGuard],
        component: FractionsPnImportComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrashInspectionPnRouting {
}
