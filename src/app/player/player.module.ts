import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CanvasComponent } from './canvas/canvas.component';
import { ControlsService } from '../services/controls.service';
import { ControlsComponent } from './controls/controls.component';
import { DrawerService } from './../services/drawer.service';
import { PlayerService } from './../services/player.service';
import { SceneService } from './../services/scene.service';
import { TrackerService } from './../services/tracker.service';
import { PlayerRoutingModule } from './player-routing.module';
import { PlayerComponent } from './player.component';

@NgModule({
  declarations: [PlayerComponent, CanvasComponent, ControlsComponent],
  imports: [CommonModule, PlayerRoutingModule],
  providers: [PlayerService, TrackerService, SceneService, ControlsService, DrawerService],
})
export class PlayerModule {}
