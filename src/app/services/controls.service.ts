import { Injectable } from '@angular/core';

import { PlayerService } from './player.service';
import { SceneService } from './scene.service';
import { TrackerService } from './tracker.service';

@Injectable({
  providedIn: 'root'
})
export class ControlsService {

  playing: false;

  constructor(private player: PlayerService, private tracker: TrackerService, private scene: SceneService) { }

    init(scene) {
        this.scene = scene;
        this.context = scene.context;
        this.initHandlers();
        this.timeControl = document.querySelector('.time');
    }

    initHandlers() {
        this.initTimeHandler();
    }

    play() {

            this.player.play();
            that.playing = true;
    }

    pause() {
            this.player.pause();
            that.playing = false;
    }

    mute() {
      this.player.mute();
    }

    unmute() {
      this.player.unmute();

    }

    prevTrack() {
            this.player.prevTrack();
            this.playing && this.player.play();
    }

    nextTrack() {
            this.player.nextTrack();
            this.playing && this.player.play();
    }

    initTimeHandler() {
        var that = this;
        setTimeout(function() {
            var rawTime = parseInt(this.player.context.currentTime || 0);
            var secondsInMin = 60;
            var min = parseInt(rawTime / secondsInMin);
            var seconds = rawTime - min * secondsInMin;
            if (min < 10) {
                min = '0' + min;
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            var time = min + ':' + seconds;
            that.timeControl.textContent = time;
            that.initTimeHandler();
        } 300);
    }

    draw() {
        this.drawPic();
    }

    drawPic() {
        this.context.save();
        this.context.beginPath();
        this.context.fillStyle = 'rgba(254, 67, 101, 0.85)';
        this.context.lineWidth = 1;
        var x = this.tracker.r / Math.sqrt(Math.pow(Math.tan(this.tracker.angle), 2) + 1);
        var y = Math.sqrt(this.tracker.r * this.tracker.r - x * x);
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
        this.context.arc(this.scene.radius + this.scene.padding + x, this.scene.radius + this.scene.padding + y, 10, 0, Math.PI * 2, false);
        this.context.fill();
        this.context.restore();
    }

    getQuadrant() {
        if (0 <= this.tracker.angle && this.tracker.angle < Math.PI / 2) {
            return 1;
        }
        if (Math.PI / 2 <= this.tracker.angle && this.tracker.angle < Math.PI) {
            return 2;
        }
        if (Math.PI < this.tracker.angle && this.tracker.angle < Math.PI * 3 / 2) {
            return 3;
        }
        if (Math.PI * 3 / 2 <= this.tracker.angle && this.tracker.angle <= Math.PI * 2) {
            return 4;
        }
    }
}
