import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'wel-controls',
  templateUrl: './controls.component.html',
  styles: [],
})
export class ControlsComponent implements AfterViewInit {
 //  @ViewChild('time') public time: ElementRef;

  isPlaying = false;
  isMuted = false;

  constructor(private playerService: PlayerService) {}

  ngAfterViewInit() {
    // const timeEl: HTMLDivElement = this.time.nativeElement;
  }

  onPlay() {
    this.isPlaying = true;
    this.playerService.play();
  }

  onPause() {
    this.isPlaying = false;
    this.playerService.pause();
  }

  onPrev() {
    this.playerService.prevTrack();
    this.isPlaying = true;
    this.playerService.play();
  }

  onNext() {
    this.playerService.nextTrack();
    this.isPlaying = true;
    this.playerService.play();
  }

  onMuteOrUnmute() {
    if (this.isMuted) {
      this.isMuted = false;
      this.playerService.unmute();
    } else {
      this.isMuted = true;
      this.playerService.mute();
    }
  }
}
