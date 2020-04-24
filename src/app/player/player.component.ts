import { Component } from '@angular/core';

import { ControlsService } from './../services/controls.service';
import { DrawerService } from './../services/drawer.service';
import { SceneService } from './../services/scene.service';
import { TrackerService } from './../services/tracker.service';

@Component({
  selector: 'wel-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  constructor(
    private sceneService: SceneService,
    private trackerService: TrackerService,
    private controlService: ControlsService,
    private drawerService: DrawerService
  ) {}
}
