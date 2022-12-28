import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PermissionGuard} from 'src/app/common/guards';
import {
  TransporterImportComponent,
  TransporterPageComponent,
} from './components';
import {TrashInspectionPnClaims} from '../../enums';

export const routes: Routes = [
  {
    path: '',
    component: TransporterPageComponent,
    canActivate: [PermissionGuard],
    data: { requiredPermission: TrashInspectionPnClaims.accessTransporter },
  },
  {
    path: 'import',
    component: TransporterImportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransportersRouting {}
