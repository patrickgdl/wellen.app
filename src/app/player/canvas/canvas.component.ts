import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'wel-canvas',
  template: `<canvas #canvas></canvas>`
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: false }) public canvas: ElementRef;

  constructor(
    private playerService: PlayerService
  ) {
  }

  ngOnInit() {}

  ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;

    this.playerService.init(canvasEl);
  }
}
