import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminGuard, AuthGuard, PermissionGuard} from 'src/app/common/guards';
import {TrashInspectionPnLayoutComponent} from './layouts';
import {
  TrashInspectionsPageComponent,
  InstallationsPageComponent,
  TrashInspectionSettingsComponent,
  FractionsPageComponent,
  FractionsPnImportComponent, ProducerImportComponent, TransporterImportComponent, ReportPreviewTableComponent
} from './components';
import {SegmentsPageComponent} from './components/segments';
import {ProducerPageComponent} from './components/producers';
import {TransporterPageComponent} from './components/transporters';
import {TrashInspectionPnClaims} from './enums';

export const routes: Routes = [
  {
    path: '',
    component: TrashInspectionPnLayoutComponent,
    canActivate: [PermissionGuard],
    data: {requiredPermission: TrashInspectionPnClaims.accessTrashInspectionPlugin},
    children: [
      {
        path: 'trash-inspections',
        canActivate: [PermissionGuard],
        component: TrashInspectionsPageComponent,
        data: {requiredPermission: TrashInspectionPnClaims.accessTrashInspectionPlugin}
      },
      {
        path: 'installations',
        canActivate: [PermissionGuard],
        component: InstallationsPageComponent,
        data: {requiredPermission: TrashInspectionPnClaims.accessInstallation}
      },
      {
        path: 'settings',
        canActivate: [AdminGuard],
        component: TrashInspectionSettingsComponent
      },
      {
        path: 'fractions',
        canActivate: [PermissionGuard],
        component: FractionsPageComponent,
        data: {requiredPermission: TrashInspectionPnClaims.accessFraction}
      },
      {
        path: 'segments',
        canActivate: [PermissionGuard],
        component: SegmentsPageComponent,
        data: {requiredPermission: TrashInspectionPnClaims.accessSegment}
      },
      {
        path: 'importfraction',
        canActivate: [PermissionGuard],
        component: FractionsPnImportComponent,
        data: {requiredPermission: TrashInspectionPnClaims.accessTrashInspectionPlugin}
      },
      {
        path: 'producers',
        canActivate: [PermissionGuard],
        component: ProducerPageComponent,
        data: {requiredPermission: TrashInspectionPnClaims.accessProducer}
      },
      {
        path: 'importproducers',
        canActivate: [PermissionGuard],
        component: ProducerImportComponent
      },
      {
        path: 'transporters',
        canActivate: [PermissionGuard],
        component: TransporterPageComponent,
        data: {requiredPermission: TrashInspectionPnClaims.accessTransporter}
      },
      {
        path: 'importtransporters',
        canActivate: [PermissionGuard],
        component: TransporterImportComponent
      },
      {
        path: 'reports',
        canActivate: [PermissionGuard],
        component: ReportPreviewTableComponent,
        data: {requiredPermission: TrashInspectionPnClaims.accessReport}
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
