import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DrawerService } from './drawer.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  constructor(private http: HttpClient, private drawer: DrawerService) {}

  buffer = null;
  duration = 0;
  tracks = [
    {
      artist: 'Kavinsky',
      song: 'Odd Look ft. The Weeknd',
      url: '//katiebaca.com/tutorial/odd-look.mp3'
    }
  ];

  init() {
    window.AudioContext = window.AudioContext; // || window.webkitAudioContext;
    this.context = new AudioContext();
    this.context.suspend && this.context.suspend();
    this.firstLaunch = true;

    try {
      this.javascriptNode = this.context.createScriptProcessor(2048, 1, 1);
      this.javascriptNode.connect(this.context.destination);
      this.analyser = this.context.createAnalyser();
      this.analyser.connect(this.javascriptNode);
      this.analyser.smoothingTimeConstant = 0.6;
      this.analyser.fftSize = 2048;
      this.source = this.context.createBufferSource();
      this.destination = this.context.destination;
      this.loadTrack(0);

      this.gainNode = this.context.createGain();
      this.source.connect(this.gainNode);
      this.gainNode.connect(this.analyser);
      this.gainNode.connect(this.destination);

      this.initHandlers();
    } catch (e) {
      this.drawer.setLoadingPercent(1);
    }

    this.drawer.setLoadingPercent(1);
    Scene.init();
  }

  loadTrack(index: number) {
    const track = this.tracks[index];
    document.querySelector('.song .artist').textContent = track.artist;
    document.querySelector('.song .name').textContent = track.song;

    this.http.get(track.url, { responseType: 'arraybuffer' }).subscribe(response => {
      this.audioCtx
        .decodeAudioData(response)
        .then(audioBuff => {
          this.source.buffer = buffer;
        })
        .catch(error => {
          this.onError(error);
        });
    });
  }

  nextTrack() {
    return;
    // ++this.currentSongIndex;
    // if (this.currentSongIndex == this.tracks.length) {
    //   this.currentSongIndex = 0;
    // }

    // this.loadTrack(this.currentSongIndex);
  }

  prevTrack() {
    return;
    // --this.currentSongIndex;
    // if (this.currentSongIndex == -1) {
    //   this.currentSongIndex = this.tracks.length - 1;
    // }

    // this.loadTrack(this.currentSongIndex);
  }

  play() {
    this.context.resume && this.context.resume();

    if (this.firstLaunch) {
      this.source.start();
      this.firstLaunch = false;
    }
  }

  stop() {
    this.context.currentTime = 0;
    this.context.suspend();
  }

  pause() {
    this.context.suspend();
  }

  mute() {
    this.gainNode.gain.value = 0;
  }

  unmute() {
    this.gainNode.gain.value = 1;
  }

  initHandlers() {
    var that = this;

    this.javascriptNode.onaudioprocess = function() {
      this.drawer.frequencyData = new Uint8Array(that.analyser.frequencyBinCount);
      that.analyser.getByteFrequencyData(this.drawer.frequencyData);
    };
  }
}
