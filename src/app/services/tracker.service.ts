import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { pairwise, switchMap, takeUntil } from 'rxjs/operators';

import { PlayerService } from './player.service';

@Injectable()
export class TrackerService {
  innerDelta = 20;
  lineWidth = 7;
  prevAngle = 0.5;
  angle = 0;
  animationCount = 10;
  pressButton = false;
  animatedInProgress = false;

  constructor() {}

  // initHandlers(canvasEl: HTMLCanvasElement) {
  //   fromEvent(canvasEl, 'mousedown')
  //     .pipe(
  //       switchMap((evt: MouseEvent) => {
  //         // should be a mouse down event
  //         if (this.isInsideOfSmallCircle(evt) || this.isOusideOfBigCircle(evt)) {
  //           return;
  //         }
  //         this.prevAngle = this.angle;
  //         this.pressButton = true;
  //         this.stopAnimation();
  //         this.calculateAngle(evt, true);

  //         return fromEvent(canvasEl, 'mousemove').pipe(
  //           takeUntil(fromEvent(canvasEl, 'mouseup')),
  //           takeUntil(fromEvent(canvasEl, 'mouseleave')),
  //           pairwise() /* Return the previous and last values as array */
  //         );
  //       })
  //     )
  //     .subscribe((res: [MouseEvent, MouseEvent]) => {
  //       // on mouseup event
  //       if (!this.pressButton) {
  //         return;
  //       }
  //       const id = setInterval(() => {
  //         if (!this.animatedInProgress) {
  //           this.pressButton = false;
  //           this.playerService.audioCtx.currentTime = (this.angle / (2 * Math.PI)) * this.playerService.source.buffer.duration;
  //           clearInterval(id);
  //         }
  //       }, 100);

  //       // should use a mousemove event
  //       if (this.animatedInProgress) {
  //         return;
  //       }
  //       if (this.pressButton && this.inProcess()) {
  //         this.calculateAngle(res[1], true); // i have manually input true here but dont know if it is right
  //       }
  //     });
  // }

  // isInsideOfSmallCircle(e) {
  //   const x = Math.abs(e.pageX - this.cx - this.coord.left);
  //   const y = Math.abs(e.pageY - this.cy - this.coord.top);
  //   return Math.sqrt(x * x + y * y) < this.radius - 3 * this.innerDelta;
  // }

  // isOusideOfBigCircle(e) {
  //   return Math.abs(e.pageX - this.cx - this.coord.left) > this.radius || Math.abs(e.pageY - this.cy - this.coord.top) > this.radius;
  // }

  // draw() {
  //   if (!this.playerService.source.buffer) {
  //     return;
  //   }
  //   if (!this.pressButton) {
  //     this.angle = (this.playerService.audioCtx.currentTime / this.playerService.source.buffer.duration) * 2 * Math.PI || 0;
  //   }
  //   this.drawArc();
  // }

  // drawArc() {
  //   this.canvasCtx.save();
  //   this.canvasCtx.strokeStyle = 'rgba(254, 67, 101, 0.8)';
  //   this.canvasCtx.beginPath();
  //   this.canvasCtx.lineWidth = this.lineWidth;

  //   this.r = this.radius - (this.innerDelta + this.lineWidth / 2);

  //   this.canvasCtx.arc(this.radius + this.padding, this.radius + this.padding, this.r, 0, this.angle, false);
  //   this.canvasCtx.stroke();
  //   this.canvasCtx.restore();
  // }

  // calculateAngle(e: MouseEvent, animatedInProgress: boolean) {
  //   this.animatedInProgress = animatedInProgress;

  //   const mx = e.pageX;
  //   const my = e.pageY;

  //   this.angle = Math.atan((my - this.cy - this.coord.top) / (mx - this.cx - this.coord.left));

  //   if (mx < this.cx + this.coord.left) {
  //     this.angle = Math.PI + this.angle;
  //   }
  //   if (this.angle < 0) {
  //     this.angle += 2 * Math.PI;
  //   }
  //   if (animatedInProgress) {
  //     this.startAnimation();
  //   } else {
  //     this.prevAngle = this.angle;
  //   }
  // }

  // startAnimation() {
  //   const angle = this.angle;
  //   const l = Math.abs(this.angle) - Math.abs(this.prevAngle);
  //   const step = l / this.animationCount;
  //   let i = 0;
  //   const f = () => {
  //     this.angle += step;
  //     if (++i === this.animationCount) {
  //       this.angle = angle;
  //       this.prevAngle = angle;
  //       this.animatedInProgress = false;
  //     } else {
  //       this.animateId = setTimeout(f, 20);
  //     }
  //   };

  //   this.angle = this.prevAngle;
  //   this.animateId = setTimeout(f, 20);
  // }

  // stopAnimation() {
  //   clearTimeout(this.animateId);
  //   this.animatedInProgress = false;
  // }
}
