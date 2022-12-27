import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PermissionGuard} from 'src/app/common/guards';
import {
  FractionsPageComponent,
  FractionsPnImportComponent,
} from './components';
import {TrashInspectionPnClaims} from '../../enums';

export const routes: Routes = [
  {
    path: '',
    component: FractionsPageComponent,
    canActivate: [PermissionGuard],
    data: { requiredPermission: TrashInspectionPnClaims.accessFraction },
  },
  {
    path: 'import',
    canActivate: [PermissionGuard],
    component: FractionsPnImportComponent,
    data: { requiredPermission: TrashInspectionPnClaims.accessTrashInspectionPlugin, },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FractionsRouting {}
