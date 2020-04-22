import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'player', loadChildren: () => import('./player/player.module').then((m) => m.PlayerModule) },
  { path: '', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
