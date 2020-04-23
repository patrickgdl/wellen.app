import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

const FFT_SIZE = 2048;

@Injectable()
export class PlayerService {
  // Observable canvas element source
  private canvasElSource = new Subject<HTMLCanvasElement>();

  tracks = [
    {
      artist: 'SAINt JHN & Imanbek Remix',
      song: 'Roses',
      url: '../../assets/audio/roses.mp3',
    },
  ];
  firstLaunch = true;
  audioCtx: AudioContext;
  analyser: AnalyserNode;
  sourceNode: AudioBufferSourceNode;
  gainNode: GainNode;
  frequencyData: Uint8Array;

  constructor(private http: HttpClient) {}

  /**
   * Init audio api fn instances.
   */
  init(canvasEl: HTMLCanvasElement) {
    this.setContext();
    this.setAnalyser();
    this.setFrequencyData();
    this.setBufferSourceNode();
    this.setGainNode();

    this.loadTrack(0);

    this.canvasElSource.next(canvasEl);
  }

  /**
   *  Observable canvas element stream
   */
  get canvasEl$() {
    return this.canvasElSource.asObservable();
  }

  /**
   * Set current audio context.
   */
  setContext() {
    try {
      this.audioCtx = new AudioContext();
    } catch (e) {
      console.log('Web Audio API is not supported.', e);
    }
  }

  /**
   * Set buffer analyser.
   */
  setAnalyser() {
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.6;
    this.analyser.fftSize = FFT_SIZE;
  }

  /**
   * Set frequency data.
   */
  setFrequencyData() {
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
  }

  /**
   * Set source buffer.
   */
  setBufferSourceNode() {
    this.sourceNode = this.audioCtx.createBufferSource();
    this.sourceNode.loop = false; // loop property
  }

  /**
   * Set gain source and connect processor and analyser.
   */
  setGainNode() {
    this.gainNode = this.audioCtx.createGain();
    this.sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.analyser);
    this.gainNode.connect(this.audioCtx.destination);
  }

  /**
   * Load track music from a specified index.
   */
  loadTrack(index: number) {
    const track = this.tracks[index];
    document.querySelector('.song .artist').textContent = track.artist;
    document.querySelector('.song .name').textContent = track.song;

    this.http.get(track.url, { responseType: 'arraybuffer' }).subscribe((response) => {
      this.audioCtx
        .decodeAudioData(response)
        .then((audioBuff) => {
          this.sourceNode.buffer = audioBuff;
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
    this.audioCtx.resume();

    if (this.firstLaunch) {
      this.sourceNode.start();
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
}
