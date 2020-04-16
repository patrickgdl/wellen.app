import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SceneService {
  private inProcess = false;
  padding = 120;
  minSize = 740;
  optimiseHeight: 982;

  constructor(private framerService) {}

  init() {
    this.canvasConfigure();
    this.initHandlers();

    this.startRender();
  }

  canvasConfigure() {
    this.canvas = document.querySelector('canvas');
    this.context = this.canvas.getContext('2d');
    this.context.strokeStyle = '#FE4365';
    this.calculateSize();
  }

  calculateSize() {
    this.scaleCoef = Math.max(0.5, 740 / this.optimiseHeight);

    const size = Math.max(this.minSize, 1 /*document.body.clientHeight */);
    this.canvas.setAttribute('width', size);
    this.canvas.setAttribute('height', size);
    // this.canvas.style.marginTop = -size / 2 + 'px';
    // this.canvas.style.marginLeft = -size / 2 + 'px';

    this.width = size;
    this.height = size;

    this.radius = (size - this.padding * 2) / 2;
    this.cx = this.radius + this.padding;
    this.cy = this.radius + this.padding;
    this.coord = this.canvas.getBoundingClientRect();
  }

  initHandlers() {
    var that = this;
    window.onresize = function() {
      that.canvasConfigure();
      Framer.configure();
      that.render();
    };
  }

  render() {
    var that = this;
    requestAnimationFrame(function() {
      that.clear();
      that.draw();
      if (this.inProcess) {
        that.render();
      }
    });
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  draw() {
    Framer.draw();
    Tracker.draw();
    Controls.draw();
  }

  startRender() {
    this.inProcess = true;
    this.render();
  }

  stopRender() {
    this.inProcess = false;
  }
}
