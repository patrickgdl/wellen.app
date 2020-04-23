import { Injectable } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { pairwise, switchMap, takeUntil } from 'rxjs/operators';

import { PlayerService } from './player.service';
import { SceneService } from './scene.service';

@Injectable()
export class TrackerService {
  private canvasCtx: CanvasRenderingContext2D;
  private animateId: number;

  // Observable canvas context source
  private canvasCtxSource = new Subject<CanvasRenderingContext2D>();

  // Observable canvas context stream
  canvasCtx$ = this.canvasCtxSource.asObservable();

  trackerRadius: number;
  position: number;
  prevAngle = 0.5;
  angle = 0;
  animationCount = 10;
  pressButton = false;
  animatedInProgress = false;

  constructor(private sceneService: SceneService, private playerService: PlayerService) {
    sceneService.canvasCtx$.subscribe((ctx) => {
      this.canvasCtx = ctx;
      this.draw();
    });

    sceneService.canvasEl$.subscribe((el) => {
      this.initHandlers(el);
    });
  }

  initHandlers(canvasEl: HTMLCanvasElement) {
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((evt: MouseEvent) => {
          // should be a mouse down event
          if (this.isInsideOfSmallCircle(evt) || this.isOusideOfBigCircle(evt)) {
            return;
          }
          this.prevAngle = this.angle;
          this.pressButton = true;
          this.stopAnimation();
          this.calculateAngle(evt, true);

          return fromEvent(canvasEl, 'mousemove').pipe(
            takeUntil(fromEvent(canvasEl, 'mouseup')),
            takeUntil(fromEvent(canvasEl, 'mouseleave')),
            pairwise() /* Return the previous and last values as array */
          );
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        // on mouseup event
        if (!this.pressButton) {
          return;
        }
        const id = setInterval(() => {
          if (!this.animatedInProgress) {
            this.pressButton = false;
            // this.playerService.audioCtx.currentTime = (this.angle / (2 * Math.PI)) * this.playerService.source.buffer.duration;
            clearInterval(id);
          }
        }, 100);

        // should use a mousemove event
        if (this.animatedInProgress) {
          return;
        }
        if (this.pressButton && this.sceneService.inProcess) {
          this.calculateAngle(res[1], true); // i have manually input true here but dont know if it is right
        }
      });
  }

  isInsideOfSmallCircle(e: MouseEvent) {
    const x = Math.abs(e.pageX - this.sceneService.cx - this.sceneService.coord.left);
    const y = Math.abs(e.pageY - this.sceneService.cy - this.sceneService.coord.top);
    return Math.sqrt(x * x + y * y) < this.sceneService.radius - 3 * this.sceneService.innerDelta;
  }

  isOusideOfBigCircle(e: MouseEvent) {
    return (
      Math.abs(e.pageX - this.sceneService.cx - this.sceneService.coord.left) > this.sceneService.radius ||
      Math.abs(e.pageY - this.sceneService.cy - this.sceneService.coord.top) > this.sceneService.radius
    );
  }

  draw() {
    if (!this.playerService.sourceNode.buffer) {
      return;
    }
    if (!this.pressButton) {
      this.angle = (this.playerService.audioCtx.currentTime / this.playerService.sourceNode.buffer.duration) * 2 * Math.PI || 0;
    }
    this.drawArc();
  }

  drawArc() {
    this.canvasCtx.save();
    this.canvasCtx.strokeStyle = 'rgba(254, 67, 101, 0.8)';
    this.canvasCtx.beginPath();
    this.canvasCtx.lineWidth = this.sceneService.lineWidth;

    this.trackerRadius = this.sceneService.radius - (this.sceneService.innerDelta + this.sceneService.lineWidth / 2);

    this.position = this.sceneService.radius + this.sceneService.padding;

    this.canvasCtx.arc(this.position, this.position, this.trackerRadius, 0, this.angle, false);
    this.canvasCtx.stroke();
    this.canvasCtx.restore();

    this.canvasCtxSource.next(this.canvasCtx);
  }

  calculateAngle(e: MouseEvent, animatedInProgress: boolean) {
    this.animatedInProgress = animatedInProgress;

    const mx = e.pageX;
    const my = e.pageY;

    // tslint:disable-next-line: max-line-length
    this.angle = Math.atan((my - this.sceneService.cy - this.sceneService.coord.top) / (mx - this.sceneService.cx - this.sceneService.coord.left));

    if (mx < this.sceneService.cx + this.sceneService.coord.left) {
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
    const angle = this.angle;
    const l = Math.abs(this.angle) - Math.abs(this.prevAngle);
    const step = l / this.animationCount;
    let i = 0;
    const f = () => {
      this.angle += step;
      if (++i === this.animationCount) {
        this.angle = angle;
        this.prevAngle = angle;
        this.animatedInProgress = false;
      } else {
        this.animateId = window.setTimeout(f, 20);
      }
    };

    this.angle = this.prevAngle;
    this.animateId = window.setTimeout(f, 20);
  }

  stopAnimation() {
    window.clearTimeout(this.animateId);
    this.animatedInProgress = false;
  }
}
