import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CanvasComponent } from '../canvas/canvas.component';
import { ControlsComponent } from './../controls/controls.component';
import { PlayerRoutingModule } from './player-routing.module';
import { PlayerComponent } from './player.component';

@NgModule({
  declarations: [PlayerComponent, CanvasComponent, ControlsComponent],
  imports: [CommonModule, PlayerRoutingModule],
})
export class PlayerModule {}
