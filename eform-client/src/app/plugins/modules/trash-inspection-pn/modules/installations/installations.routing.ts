import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PermissionGuard} from 'src/app/common/guards';
import {
  InstallationsPageComponent
} from './components';
import {TrashInspectionPnClaims} from '../../enums';

export const routes: Routes = [
  {
    path: '',
    component: InstallationsPageComponent,
    canActivate: [PermissionGuard],
    data: { requiredPermission: TrashInspectionPnClaims.accessInstallation },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstallationsRouting {}
