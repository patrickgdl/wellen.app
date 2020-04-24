import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'player-1', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule) },
  { path: 'player-2', loadChildren: () => import('./player/player.module').then((m) => m.PlayerModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
