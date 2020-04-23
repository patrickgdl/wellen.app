import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { PlayerService } from './player.service';

@Injectable()
export class SceneService {
  private canvasCtx: CanvasRenderingContext2D;
  private canvasEl: HTMLCanvasElement;

  // Observable canvas context and element source
  private canvasElSource = new Subject<HTMLCanvasElement>();
  private canvasCtxSource = new Subject<CanvasRenderingContext2D>();

  // Observable canvas context and element stream
  canvasEl$ = this.canvasElSource.asObservable();
  canvasCtx$ = this.canvasCtxSource.asObservable();

  inProcess = false;
  innerDelta = 20;
  lineWidth = 7;
  width: number;
  height: number;
  padding = 120;
  minSize = 740;
  optimiseHeight = 982;
  scaleCoef: number;
  radius: number;
  cx: number;
  cy: number;
  coord: DOMRect;

  constructor(private playerService: PlayerService) {
    playerService.canvasEl$.subscribe(el => {
      console.log(el);
      this.canvasConfigure(el);
    });
  }

  canvasConfigure(canvasEl: HTMLCanvasElement) {
    console.log(canvasEl);
    this.canvasEl = canvasEl;
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
      this.playerService.analyser.getByteFrequencyData(this.playerService.frequencyData);
      if (this.inProcess) {
        this.render();
      }
    });
  }

  clear() {
    this.canvasCtx.clearRect(0, 0, this.width, this.height);
  }

  draw() {
    this.canvasElSource.next(this.canvasEl);
    this.canvasCtxSource.next(this.canvasCtx);
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
