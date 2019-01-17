import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminGuard, AuthGuard} from 'src/app/common/guards';
import {TrashInspectionPnLayoutComponent} from './layouts';
import {MachinesPageComponent, AreasPageComponent} from './components';
import {MachineAreaSettingsComponent} from './components/machine-area-settings';

export const routes: Routes = [
  {
    path: '',
    component: TrashInspectionPnLayoutComponent,
    children: [
      {
        path: 'machines',
        canActivate: [AuthGuard],
        component: MachinesPageComponent
      },
      {
        path: 'areas',
        canActivate: [AdminGuard],
        component: AreasPageComponent
      },
      {
        path: 'settings',
        canActivate: [AdminGuard],
        component: MachineAreaSettingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MachineAreaPnRouting {
}
