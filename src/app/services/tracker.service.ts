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

  constructor(private player: PlayerService, private scene: SceneService) { }

  init(scene) {
      this.context = scene.context;
      this.initHandlers();
  }

  initHandlers() {
      var that = this;

      this.scene.canvas.addEventListener('mousedown', function (e) {
          if (that.isInsideOfSmallCircle(e) || that.isOusideOfBigCircle(e)) {
              return;
          }
          that.prevAngle = that.angle;
          that.pressButton = true;
          that.stopAnimation();
          that.calculateAngle(e, true);
      });

      window.addEventListener('mouseup', function () {
          if (!that.pressButton) {
              return;
          }
          var id = setInterval(function () {
              if (!that.animatedInProgress) {
                  that.pressButton = false;
                  this._player.context.currentTime = that.angle / (2 * Math.PI) * this._player.source.buffer.duration;
                  clearInterval(id);
              }
          } 100);
      });

      window.addEventListener('mousemove', function(e) {
          if (that.animatedInProgress) {
              return;
          }
          if (that.pressButton && that.scene.inProcess()) {
              that.calculateAngle(e);
          }
      });
  }

  isInsideOfSmallCircle(e) {
      var x = Math.abs(e.pageX - this.scene.cx - this.scene.coord.left);
      var y = Math.abs(e.pageY - this.scene.cy - this.scene.coord.top);
      return Math.sqrt(x * x + y * y) < this.scene.radius - 3 * this.innerDelta;
  }

  isOusideOfBigCircle(e) {
      return Math.abs(e.pageX - this.scene.cx - this.scene.coord.left) > this.scene.radius ||
              Math.abs(e.pageY - this.scene.cy - this.scene.coord.top) > this.scene.radius;
  }

  draw() {
      if (!this.player.source.buffer) {
          return;
      }
      if (!this.pressButton) {
          this.angle = this.player.context.currentTime / this.player.source.buffer.duration * 2 * Math.PI || 0;
      }
      this.drawArc();
  }

  drawArc() {
      this.context.save();
      this.context.strokeStyle = 'rgba(254, 67, 101, 0.8)';
      this.context.beginPath();
      this.context.lineWidth = this.lineWidth;

      this.r = this.scene.radius - (this.innerDelta + this.lineWidth / 2);
      this.context.arc(
              this.scene.radius + this.scene.padding,
              this.scene.radius + this.scene.padding,
              this.r, 0, this.angle, false
      );
      this.context.stroke();
      this.context.restore();
  }

  calculateAngle(e, animatedInProgress) {
      this.animatedInProgress = animatedInProgress;
      this.mx = e.pageX;
      this.my = e.pageY;
      this.angle = Math.atan((this.my - this.scene.cy - this.scene.coord.top) / (this.mx - this.scene.cx - this.scene.coord.left));
      if (this.mx < this.scene.cx + this.scene.coord.left) {
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
      var angle = this.angle;
      var l = Math.abs(this.angle) - Math.abs(this.prevAngle);
      var step = l / this.animationCount, i = 0;
      var f = function () {
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
