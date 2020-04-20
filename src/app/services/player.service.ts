import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DrawerService } from './drawer.service';
import { SceneService } from './scene.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  tracks = [
    {
      artist: 'Kavinsky',
      song: 'Odd Look ft. The Weeknd',
      url: '//katiebaca.com/tutorial/odd-look.mp3',
    },
  ];
  firstLaunch = false;

  audioCtx: AudioContext;
  javascriptNode: ScriptProcessorNode;
  analyser: AnalyserNode;
  source: AudioBufferSourceNode;
  destination: AudioDestinationNode;
  gainNode: GainNode;

  constructor(private http: HttpClient, private drawerService: DrawerService, private sceneService: SceneService) {}

  init() {
    this.audioCtx = new AudioContext();
    // this.context.suspend && this.context.suspend();
    this.firstLaunch = true;

    try {
      this.javascriptNode = this.audioCtx.createScriptProcessor(2048, 1, 1);
      this.javascriptNode.connect(this.audioCtx.destination);

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.connect(this.javascriptNode);
      this.analyser.smoothingTimeConstant = 0.6;
      this.analyser.fftSize = 2048;

      this.source = this.audioCtx.createBufferSource();
      this.destination = this.audioCtx.destination;

      this.loadTrack(0);

      this.gainNode = this.audioCtx.createGain();

      this.source.connect(this.gainNode);

      this.gainNode.connect(this.analyser);
      this.gainNode.connect(this.destination);

      this.initHandlers();
    } catch (e) {
      this.drawerService.setLoadingPercent(1);
    }

    this.drawerService.setLoadingPercent(1);
    this.sceneService.init();
  }

  loadTrack(index: number) {
    const track = this.tracks[index];
    document.querySelector('.song .artist').textContent = track.artist;
    document.querySelector('.song .name').textContent = track.song;

    this.http.get(track.url, { responseType: 'arraybuffer' }).subscribe((response) => {
      this.audioCtx
        .decodeAudioData(response)
        .then((audioBuff) => {
          this.source.buffer = audioBuff;
        })
        .catch((error) => {
          this.onError(error);
        });
    });
  }

  /**
   * On audio data stream error fn.
   */
  onError(e) {
    console.log('Error decoding audio file. -- ', e);
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
    // this.audioCtx.resume && this.audioCtx.resume();

    if (this.firstLaunch) {
      this.source.start();
      this.firstLaunch = false;
    }
  }

  stop() {
    // this.audioCtx.currentTime = 0;
    this.audioCtx.suspend();
  }

  pause() {
    this.audioCtx.suspend();
  }

  mute() {
    this.gainNode.gain.value = 0;
  }

  unmute() {
    this.gainNode.gain.value = 1;
  }

  initHandlers() {
    this.javascriptNode.onaudioprocess = () => {
      this.drawerService.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(this.drawerService.frequencyData);
    };
  }
}
