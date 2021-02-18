import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '@app/core';
import { TeaPage } from './tea.page';

const routes: Routes = [
  {
    path: '',
    component: TeaPage,
    canActivate: [AuthGuardService],
  },
  {
    path: 'tea-details',
    loadChildren: () =>
      import('../tea-details/tea-details.module').then(
        m => m.TeaDetailsPageModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeaPageRoutingModule {}
