import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { ControlsService } from '../services/controls.service';

@Component({
  selector: 'wel-controls',
  templateUrl: './controls.component.html',
  styles: []
})
export class ControlsComponent implements AfterViewInit {
  @ViewChild('play') public playEl: ElementRef;
  @ViewChild('pause') public pauseEl: ElementRef;
  @ViewChild('prevSong') public prevEl: ElementRef;
  @ViewChild('nextSong') public nextEl: ElementRef;
  @ViewChild('soundControl') public muteEl: ElementRef;
  @ViewChild('time') public timeEl: ElementRef;

  isPlaying = false;

  constructor(private controls: ControlsService) {}

  ngAfterViewInit() {
  }

  onPlay() {
    this.isPlaying = true;
    this.controls.play();
  }

  onPause() {
    this.isPlaying = false;
    this.controls.pause();
  }

  onPrev() {
    this.controls.prevTrack();
    this.isPlaying = true;
    this.controls.play();
  }

  onNext() {
    this.controls.nextTrack();
    this.isPlaying = true;
    this.controls.play();
  }

  onMuteOrDesmute() {
    if (this.muteEl.classList.contains('disable')) {
      this.muteEl.classList.remove('disable');
      this.controls.unmute();
    } else {
      this.muteEl.classList.add('disable');
      this.controls.mute();
    }
  }
}
