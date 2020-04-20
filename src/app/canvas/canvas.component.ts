import { ControlsService } from './../services/controls.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { DrawerService } from './../services/drawer.service';
import { PlayerService } from './../services/player.service';
import { TrackerService } from './../services/tracker.service';

@Component({
  selector: 'wel-canvas',
  templateUrl: './canvas.component.html',
  styles: [],
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') public canvas: ElementRef;

  width: number;
  height: number;

  private inProcess = false;
  padding = 120;
  minSize = 740;
  optimiseHeight: 982;
  scaleCoef: number;

  radius: number;
  cx: number;
  cy: number;

  coord: DOMRect;

  private canvasCtx: CanvasRenderingContext2D;

  constructor(private drawerService: DrawerService, private trackerService: TrackerService, private controlsService: ControlsService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.canvasCtx = canvasEl.getContext('2d');

    this.canvasCtx.strokeStyle = '#FE4365';
    canvasEl.height = this.height;

    this.calculateSize(canvasEl);
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

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.canvasConfigure();
  //   this.drawerService.configure();
  //   this.render();
  // }

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
    this.trackerService.draw();
    this.controlsService.draw();
  }

  startRender() {
    this.inProcess = true;
    this.render();
  }

  stopRender() {
    this.inProcess = false;
  }
}
