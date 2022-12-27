import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PermissionGuard} from 'src/app/common/guards';
import {
  TrashInspectionsPageComponent,
} from './components';
import {TrashInspectionPnClaims} from '../../enums';

export const routes: Routes = [
  {
    path: '',
    component: TrashInspectionsPageComponent,
    canActivate: [PermissionGuard],
    data: { requiredPermission: TrashInspectionPnClaims.accessTrashInspectionPlugin },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrashInspectionsRouting {}
