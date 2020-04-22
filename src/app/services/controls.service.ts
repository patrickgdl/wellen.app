import { Injectable } from '@angular/core';

import { PlayerService } from './player.service';
import { TrackerService } from './tracker.service';

@Injectable({
  providedIn: 'root',
})
export class ControlsService {
  constructor(private trackerService: TrackerService, private playerService: PlayerService) {}

  initTimeHandler(timeEl: HTMLDivElement) {
    setTimeout(() => {
      const rawTime = this.playerService.audioCtx.currentTime || 0;
      const secondsInMin = 60;

      let minutes: number | string = rawTime / secondsInMin;
      let seconds: number | string = rawTime - minutes * secondsInMin;

      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }

      const time = minutes + ':' + seconds;

      timeEl.textContent = time;
      this.initTimeHandler();
    }, 300);
  }

  draw() {
    this.drawPic();
  }

  drawPic() {
    this.canvasCtx.save();
    this.canvasCtx.beginPath();
    this.canvasCtx.fillStyle = 'rgba(254, 67, 101, 0.85)';
    this.canvasCtx.lineWidth = 1;

    let x = this.trackerService.r / Math.sqrt(Math.pow(Math.tan(this.trackerService.angle), 2) + 1);
    let y = Math.sqrt(this.trackerService.r * this.trackerService.r - x * x);

    if (this.getQuadrant() === 2) {
      x = -x;
    }
    if (this.getQuadrant() === 3) {
      x = -x;
      y = -y;
    }
    if (this.getQuadrant() === 4) {
      y = -y;
    }

    this.canvasCtx.arc(
      this.radius + this.padding + x,
      this.radius + this.padding + y,
      10,
      0,
      Math.PI * 2,
      false
    );

    this.canvasCtx.fill();
    this.canvasCtx.restore();
  }

  getQuadrant() {
    if (0 <= this.trackerService.angle && this.trackerService.angle < Math.PI / 2) {
      return 1;
    }
    if (Math.PI / 2 <= this.trackerService.angle && this.trackerService.angle < Math.PI) {
      return 2;
    }
    if (Math.PI < this.trackerService.angle && this.trackerService.angle < (Math.PI * 3) / 2) {
      return 3;
    }
    if ((Math.PI * 3) / 2 <= this.trackerService.angle && this.trackerService.angle <= Math.PI * 2) {
      return 4;
    }
  }
}
