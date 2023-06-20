import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PermissionGuard} from 'src/app/common/guards';
import {
  ProducerPageComponent,
  ProducerImportComponent,
} from './components';
import {TrashInspectionPnClaims} from '../../enums';

export const routes: Routes = [
  {
    path: '',
    component: ProducerPageComponent,
    canActivate: [PermissionGuard],
    data: { requiredPermission: TrashInspectionPnClaims.accessProducer },
  },
  {
    path: 'import',
    component: ProducerImportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProducersRouting {}
