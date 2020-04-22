import { Injectable } from '@angular/core';

import { SceneService } from './scene.service';
import { TrackerService } from './tracker.service';

@Injectable()
export class DrawerService {
  countTicks = 360;
  maxTickSize: number;
  frequencyData: Uint8Array;
  tickSize = 10;
  PI = 360;
  index = 0;
  loadingAngle = 0;

  constructor(private sceneService: SceneService, private trackerService: TrackerService) {}

  configure() {
    this.maxTickSize = this.tickSize * 9 * this.sceneService.scaleCoef;
    this.countTicks = 360 * this.sceneService.scaleCoef;
  }

  draw() {
    this.drawTicks();
    this.drawEdging();
  }

  drawTicks() {
    this.sceneService.canvasCtx.save();
    this.sceneService.canvasCtx.beginPath();
    this.sceneService.canvasCtx.lineWidth = 1;

    const ticks = this.getTicks(this.countTicks, this.tickSize, [0, 90]);
    for (let i = 0, len = ticks.length; i < len; ++i) {
      const tick = ticks[i];
      this.drawTick(tick.x1, tick.y1, tick.x2, tick.y2);
    }

    this.sceneService.canvasCtx.restore();
  }

  drawTick(x1: number, y1: number, x2: number, y2: number) {
    const dx1 = this.sceneService.cx + x1;
    const dy1 = this.sceneService.cy + y1;

    const dx2 = this.sceneService.cx + x2;
    const dy2 = this.sceneService.cy + y2;

    const gradient = this.sceneService.canvasCtx.createLinearGradient(dx1, dy1, dx2, dy2);

    gradient.addColorStop(0, '#FE4365');
    gradient.addColorStop(0.6, '#FE4365');
    gradient.addColorStop(1, '#F5F5F5');

    this.sceneService.canvasCtx.beginPath();
    this.sceneService.canvasCtx.strokeStyle = gradient;
    this.sceneService.canvasCtx.lineWidth = 2;
    this.sceneService.canvasCtx.moveTo(this.sceneService.cx + x1, this.sceneService.cx + y1);
    this.sceneService.canvasCtx.lineTo(this.sceneService.cx + x2, this.sceneService.cx + y2);
    this.sceneService.canvasCtx.stroke();
  }

  setLoadingPercent(percent: number) {
    this.loadingAngle = percent * 2 * Math.PI;
  }

  drawEdging() {
    this.sceneService.canvasCtx.save();
    this.sceneService.canvasCtx.beginPath();
    this.sceneService.canvasCtx.strokeStyle = 'rgba(254, 67, 101, 0.5)';
    this.sceneService.canvasCtx.lineWidth = 1;

    const offset = this.trackerService.lineWidth / 2;
    this.sceneService.canvasCtx.moveTo(
      this.sceneService.padding + 2 * this.sceneService.radius - this.trackerService.innerDelta - offset,
      this.sceneService.padding + this.sceneService.radius
    );

    this.sceneService.canvasCtx.arc(
      this.sceneService.cx,
      this.sceneService.cy,
      this.sceneService.radius - this.trackerService.innerDelta - offset,
      0,
      this.loadingAngle,
      false
    );

    this.sceneService.canvasCtx.stroke();
    this.sceneService.canvasCtx.restore();
  }

  getTicks(count: number, size: number, animationParams: number[]) {
    size = 10;
    const ticks = this.getTickPoints(count);
    let x1: number;
    let y1: number;
    let x2: number;
    let y2: number;
    let m = [];
    let tick: {x: number, y: number, angle: number};
    let k: number;
    const lesser = 160;
    const allScales = [];

    for (let i = 0, len = ticks.length; i < len; ++i) {
      const coef = 1 - i / (len * 2.5);
      let delta = ((this.frequencyData[i] || 0) - lesser * coef) * this.sceneService.scaleCoef;
      if (delta < 0) {
        delta = 0;
      }
      tick = ticks[i];
      if (animationParams[0] <= tick.angle && tick.angle <= animationParams[1]) {
        // tslint:disable-next-line: max-line-length
        k = this.sceneService.radius / (this.sceneService.radius - this.getSize(tick.angle, animationParams[0], animationParams[1]) - delta);
      } else {
        k = this.sceneService.radius / (this.sceneService.radius - (size + delta));
      }

      x1 = tick.x * (this.sceneService.radius - size);
      y1 = tick.y * (this.sceneService.radius - size);
      x2 = x1 * k;
      y2 = y1 * k;

      m.push({ x1: x1, y1: y1, x2: x2, y2: y2 });

      if (i < 20) {
        let scale = delta / 50;
        scale = scale < 1 ? 1 : scale;
        allScales.push(scale);
      }
    }
    const sum = allScales.reduce((pv, cv) => pv + cv, 0) / allScales.length;

    // this.canvas.style.transform = `scale(${sum})`;

    return m;
  }

  getSize(angle: number, l: number, r: number) {
    const m = (r - l) / 2;
    const x = angle - l;
    let h: number;

    if (x === m) {
      return this.maxTickSize;
    }

    const d = Math.abs(m - x);
    const v = 70 * Math.sqrt(1 / d);

    if (v > this.maxTickSize) {
      h = this.maxTickSize - d;
    } else {
      h = Math.max(this.tickSize, v);
    }

    if (this.index > this.countTicks) {
      this.index = 0;
    }

    return h;
  }

  getTickPoints(count: number) {
    const coords: {x: number, y: number, angle: number}[] = [];
    const step = this.PI / count;

    for (let deg = 0; deg < this.PI; deg += step) {
      const rad = (deg * Math.PI) / (this.PI / 2);
      coords.push({ x: Math.cos(rad), y: -Math.sin(rad), angle: deg });
    }

    return coords;
  }
}
