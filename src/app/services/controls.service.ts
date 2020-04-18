import { Injectable } from '@angular/core';

import { PlayerService } from './player.service';
import { SceneService } from './scene.service';
import { TrackerService } from './tracker.service';

@Injectable({
  providedIn: 'root',
})
export class ControlsService {
  playing: false;

  constructor(private playerService: PlayerService, private trackerService: TrackerService, private sceneService: SceneService) {}

  init(scene) {
    this.sceneService = scene;
    this.context = scene.context;
    this.initHandlers();
    this.timeControl = document.querySelector('.time');
  }

  initHandlers() {
    this.initTimeHandler();
  }

  play() {
    this.playerService.play();
    that.playing = true;
  }

  pause() {
    this.playerService.pause();
    that.playing = false;
  }

  mute() {
    this.playerService.mute();
  }

  unmute() {
    this.playerService.unmute();
  }

  prevTrack() {
    this.playerService.prevTrack();
    this.playing && this.playerService.play();
  }

  nextTrack() {
    this.playerService.nextTrack();
    this.playing && this.playerService.play();
  }

  initTimeHandler() {
    var that = this;
    setTimeout(function () {
      const rawTime = parseInt(this.player.context.currentTime || 0);
      const secondsInMin = 60;
      let min = parseInt(rawTime / secondsInMin);
      let seconds = rawTime - min * secondsInMin;

      if (min < 10) {
        min = '0' + min;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }

      const time = min + ':' + seconds;

      that.timeControl.textContent = time;
      that.initTimeHandler();
    }, 300);
  }

  draw() {
    this.drawPic();
  }

  drawPic() {
    this.context.save();
    this.context.beginPath();
    this.context.fillStyle = 'rgba(254, 67, 101, 0.85)';
    this.context.lineWidth = 1;

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

    this.context.arc(
      this.sceneService.radius + this.sceneService.padding + x,
      this.sceneService.radius + this.sceneService.padding + y,
      10,
      0,
      Math.PI * 2,
      false
    );

    this.context.fill();
    this.context.restore();
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
