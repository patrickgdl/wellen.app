import { Injectable } from '@angular/core';

import { PlayerService } from './player.service';
import { SceneService } from './scene.service';

@Injectable({
  providedIn: 'root'
})
export class TrackerService {
  innerDelta = 20;
  lineWidth = 7;
  prevAngle = 0.5;
  angle = 0;
  animationCount = 10;
  pressButton = false;

  constructor(private playerService: PlayerService, private sceneService: SceneService) { }

  init(scene) {
      this.context = scene.context;
      this.initHandlers();
  }

  initHandlers() {
      var that = this;

      this.sceneService.canvas.addEventListener('mousedown', function(e) {
          if (that.isInsideOfSmallCircle(e) || that.isOusideOfBigCircle(e)) {
              return;
          }
          that.prevAngle = that.angle;
          that.pressButton = true;
          that.stopAnimation();
          that.calculateAngle(e, true);
      });

      window.addEventListener('mouseup', function() {
          if (!that.pressButton) {
              return;
          }
          const id = setInterval(function() {
              if (!that.animatedInProgress) {
                  that.pressButton = false;
                  this._player.context.currentTime = that.angle / (2 * Math.PI) * this._player.source.buffer.duration;
                  clearInterval(id);
              }
          }, 100);
      });

      window.addEventListener('mousemove', function(e) {
          if (that.animatedInProgress) {
              return;
          }
          if (that.pressButton && that.sceneService.inProcess()) {
              that.calculateAngle(e);
          }
      });
  }

  isInsideOfSmallCircle(e) {
      const x = Math.abs(e.pageX - this.sceneService.cx - this.sceneService.coord.left);
      const y = Math.abs(e.pageY - this.sceneService.cy - this.sceneService.coord.top);
      return Math.sqrt(x * x + y * y) < this.sceneService.radius - 3 * this.innerDelta;
  }

  isOusideOfBigCircle(e) {
      return Math.abs(e.pageX - this.sceneService.cx - this.sceneService.coord.left) > this.sceneService.radius ||
              Math.abs(e.pageY - this.sceneService.cy - this.sceneService.coord.top) > this.sceneService.radius;
  }

  draw() {
      if (!this.playerService.source.buffer) {
          return;
      }
      if (!this.pressButton) {
          this.angle = this.playerService.context.currentTime / this.playerService.source.buffer.duration * 2 * Math.PI || 0;
      }
      this.drawArc();
  }

  drawArc() {
      this.context.save();
      this.context.strokeStyle = 'rgba(254, 67, 101, 0.8)';
      this.context.beginPath();
      this.context.lineWidth = this.lineWidth;

      this.r = this.sceneService.radius - (this.innerDelta + this.lineWidth / 2);
      this.context.arc(
              this.sceneService.radius + this.sceneService.padding,
              this.sceneService.radius + this.sceneService.padding,
              this.r, 0, this.angle, false
      );
      this.context.stroke();
      this.context.restore();
  }

  calculateAngle(e, animatedInProgress) {
      this.animatedInProgress = animatedInProgress;
      this.mx = e.pageX;
      this.my = e.pageY;
      this.angle = Math.atan((this.my - this.sceneService.cy - this.sceneService.coord.top) / (this.mx - this.sceneService.cx - this.sceneService.coord.left));
      if (this.mx < this.sceneService.cx + this.sceneService.coord.left) {
          this.angle = Math.PI + this.angle;
      }
      if (this.angle < 0) {
          this.angle += 2 * Math.PI;
      }
      if (animatedInProgress) {
          this.startAnimation();
      } else {
          this.prevAngle = this.angle;
      }
  }

  startAnimation() {
      var that = this;
      const angle = this.angle;
      const l = Math.abs(this.angle) - Math.abs(this.prevAngle);
      const step = l / this.animationCount;
      const i = 0;
      const f = function () {
          that.angle += step;
          if (++i === that.animationCount) {
              that.angle = angle;
              that.prevAngle = angle;
              that.animatedInProgress = false;
          } else {
              that.animateId = setTimeout(f, 20);
          }
      };

      this.angle = this.prevAngle;
      this.animateId = setTimeout(f, 20);
  }

  stopAnimation() {
      clearTimeout(this.animateId);
      this.animatedInProgress = false;
  }
}
