import { Component, OnInit } from '@angular/core';

import { ControlsService } from './../services/controls.service';

@Component({
  selector: 'wel-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  playEl: HTMLDivElement;
  pauseEl: HTMLDivElement;
  prevEl: HTMLDivElement;
  nextEl: HTMLDivElement;
  muteEl: HTMLDivElement;

  constructor(private controls: ControlsService) {}

  ngOnInit() {
    this.playEl = document.querySelector('.pause');
    this.pauseEl = document.querySelector('.pause');
    this.prevEl = document.querySelector('.prevSong');
    this.nextEl = document.querySelector('.nextSong');
    this.muteEl = document.querySelector('.soundControl');
  }

  onPlay() {
    this.playEl.style.display = 'none';
    this.pauseEl.style.display = 'inline-block';
    this.controls.play();
    this.playing = true;
  }

  onPause() {
    this.playEl.style.display = 'inline-block';
    this.pauseEl.style.display = 'none';
    this.controls.pause();
    this.playing = false;
  }

  onPrev() {
    this.controls.prevTrack();
    this.playing && this.controls.play();
  }

  onNext() {
    this.controls.nextTrack();
    this.playing && this.controls.play();
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
