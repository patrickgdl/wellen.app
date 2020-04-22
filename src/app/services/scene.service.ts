import { Injectable } from '@angular/core';

import { ControlsService } from './controls.service';
import { DrawerService } from './drawer.service';
import { TrackerService } from './tracker.service';

@Injectable()
export class SceneService {
  private inProcess = false;

  canvasCtx: CanvasRenderingContext2D;

  width: number;
  height: number;
  padding = 120;
  minSize = 740;
  optimiseHeight: 982;
  scaleCoef: number;
  radius: number;
  cx: number;
  cy: number;
  coord: DOMRect;

  constructor(private drawerService: DrawerService, private trackerService: TrackerService, private controlsService: ControlsService) {}

  init(canvasEl: HTMLCanvasElement) {
    this.canvasConfigure(canvasEl);
  }

  canvasConfigure(canvasEl: HTMLCanvasElement) {
    this.canvasCtx = canvasEl.getContext('2d');
    this.canvasCtx.strokeStyle = '#FE4365';

    this.calculateSize(canvasEl);
    this.startRender();
  }

  calculateSize(canvasEl: HTMLCanvasElement) {
    this.scaleCoef = Math.max(0.5, 740 / this.optimiseHeight);

    const size = Math.max(this.minSize, 1 /* document.body.clientHeight */);
    canvasEl.setAttribute('width', size.toString());
    canvasEl.setAttribute('height', size.toString());
    // this.canvas.style.marginTop = -size / 2 + 'px';
    // this.canvas.style.marginLeft = -size / 2 + 'px';

    this.width = size;
    this.height = size;

    this.radius = (size - this.padding * 2) / 2;
    this.cx = this.radius + this.padding;
    this.cy = this.radius + this.padding;
    this.coord = canvasEl.getBoundingClientRect();
  }

  render() {
    requestAnimationFrame(() => {
      this.clear();
      this.draw();
      if (this.inProcess) {
        this.render();
      }
    });
  }

  clear() {
    this.canvasCtx.clearRect(0, 0, this.width, this.height);
  }

  draw() {
    this.drawerService.draw();
    // this.trackerService.draw();
    // this.controlsService.draw();
  }

  startRender() {
    this.inProcess = true;
    this.render();
  }

  stopRender() {
    this.inProcess = false;
  }
}
