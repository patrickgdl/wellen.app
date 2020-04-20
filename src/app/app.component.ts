import { AfterViewInit, Component, OnInit } from '@angular/core';

import { CanvasAudioStyle } from './models/canvas-audio-style.interface';
import { HttpClient } from '@angular/common/http';

const FFT_SIZE = 512;
const TYPE = {
  lounge: 'renderLounge',
};

@Component({
  selector: 'wel-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
  audioEl: HTMLAudioElement;
  canvasEl: HTMLCanvasElement;
  audioCtx: AudioContext;
  canvasCtx: CanvasRenderingContext2D;
  analyser: AnalyserNode;
  frequencyData: Uint8Array;
  sourceNode: AudioBufferSourceNode;
  audioSrc: string;
  gradient: CanvasGradient;
  authorAttr: string; // audio.getAttribute('data-author') || '';
  titleAttr: string; // audio.getAttribute('data-title') || '';

  canvasStyle: CanvasAudioStyle;

  interval = null;
  isPlaying = false;
  duration = 0;
  minutes: string | number = '00';
  seconds: string | number = '00';

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.audioEl = document.getElementById('myAudio') as HTMLAudioElement;
    this.canvasEl = document.getElementById('myCanvas') as HTMLCanvasElement;
    this.canvasCtx = this.canvasEl.getContext('2d');

    this.authorAttr = this.audioEl.getAttribute('data-author');
    this.titleAttr = this.audioEl.getAttribute('data-title');

    this.canvasStyle = {
      style: 'lounge',
      barWidth: 2,
      barHeight: 2,
      barSpacing: 7,
      barColor: '#FE4365',
      shadowBlur: 20,
      shadowColor: '#FE4365',
      font: ['12px', 'Arial'],
    };

    this._createVisualizer();
  }

  /**
   * Set current audio context.
   */
  setContext() {
    try {
      this.audioCtx = new window.AudioContext();
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
   * Set source buffer and connect processor and analyser.
   */
  setBufferSourceNode() {
    this.sourceNode = this.audioCtx.createBufferSource();
    this.sourceNode.loop = true; // loop property
    this.sourceNode.connect(this.analyser);
    this.sourceNode.connect(this.audioCtx.destination);

    this.sourceNode.onended = () => {
      clearInterval(this.interval);
      this.sourceNode.disconnect();
      this.resetTimer();
      this.isPlaying = false;
      this.sourceNode = this.audioCtx.createBufferSource();
    };
  }

  /**
   * Set current media source url.
   */
  setMediaSource() {
    this.audioSrc = this.audioEl.getAttribute('src');
  }

  /**
   * Set canvas gradient color and styles.
   */
  setCanvasStyles() {
    this.gradient = this.canvasCtx.createLinearGradient(0, 0, 0, 300);
    this.gradient.addColorStop(1, this.canvasStyle.barColor);

    this.canvasCtx.fillStyle = this.gradient;
    this.canvasCtx.shadowBlur = this.canvasStyle.shadowBlur;
    this.canvasCtx.shadowColor = this.canvasStyle.shadowColor;
    this.canvasCtx.font = this.canvasStyle.font.join(' ');
    this.canvasCtx.textAlign = 'center';
  }

  /**
   * Play click event.
   */
  onClick() {
    if (!this.isPlaying) {
      return this.audioCtx.state === 'suspended' ? this.playSound() : this.loadSound();
    } else {
      return this.pauseSound();
    }
  }

  /**
   * Load sound file.
   */
  loadSound() {
    this.canvasCtx.fillText('Carregando...', this.canvasEl.width / 2 + 10, this.canvasEl.height / 2);

    this.http.get(this.audioSrc, { responseType: 'arraybuffer' }).subscribe((response) => {
      this.audioCtx
        .decodeAudioData(response)
        .then((audioBuff) => {
          this.playSound(audioBuff);
        })
        .catch((error) => {
          this.onError(error);
        });
    });
  }

  /**
   * Play sound from the given buffer.
   */
  playSound(buffer?: AudioBuffer) {
    this.isPlaying = true;

    if (this.audioCtx.state === 'suspended') {
      return this.audioCtx.resume();
    }

    this.sourceNode.buffer = buffer;
    this.sourceNode.start(0);

    this.resetTimer();
    this.startTimer();
    this.renderFrame();
  }

  /**
   * Pause current sound.
   */
  pauseSound() {
    this.audioCtx.suspend();
    this.isPlaying = false;
  }

  /**
   * Start playing timer.
   */
  startTimer() {
    this.interval = setInterval(() => {
      if (this.isPlaying) {
        const now = new Date(this.duration);
        const min = now.getHours();
        const sec = now.getMinutes();
        this.minutes = min < 10 ? '0' + min : min;
        this.seconds = sec < 10 ? '0' + sec : sec;
        this.duration = now.setMinutes(sec + 1);
      }
    }, 1000);
  }

  /**
   * Reset time counter.
   */
  resetTimer() {
    const time = new Date(0, 0);
    this.duration = time.getTime();
  }

  /**
   * On audio data stream error fn.
   */
  onError(e) {
    console.log('Error decoding audio file. -- ', e);
  }

  /**
   * Render frame on canvas.
   */
  renderFrame() {
    requestAnimationFrame(this.renderFrame.bind(this));
    this.analyser.getByteFrequencyData(this.frequencyData);

    this.canvasCtx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);

    this._renderTime();
    this._renderText();
    this._renderByStyleType();
  }

  /**
   * Render audio author and title.
   */
  private _renderText() {
    const cx = this.canvasEl.width / 2;
    const cy = this.canvasEl.height / 2;
    const correction = 10;

    this.canvasCtx.textBaseline = 'top';
    this.canvasCtx.fillText('por ' + this.authorAttr, cx + correction, cy);
    this.canvasCtx.font = parseInt(this.canvasStyle.font[0], 10) + 8 + 'px ' + this.canvasStyle.font[1];
    this.canvasCtx.textBaseline = 'bottom';
    this.canvasCtx.fillText(this.titleAttr, cx + correction, cy);
    this.canvasCtx.font = this.canvasStyle.font.join(' ');
  }

  /**
   * Render audio time.
   */
  private _renderTime() {
    const time = this.minutes + ':' + this.seconds;
    this.canvasCtx.fillText(time, this.canvasEl.width / 2 + 10, this.canvasEl.height / 2 + 40);
  }

  /**
   * Render frame by style type.
   */
  private _renderByStyleType() {
    // return this[TYPE[this.canvasStyle.style]]();
    return this._renderLounge();
  }

  /**
   * Render lounge style type.
   */
  private _renderLounge() {
    const cx = this.canvasEl.width / 2;
    const cy = this.canvasEl.height / 2;
    const radius = 140;
    const maxBarNum = Math.floor((radius * 2 * Math.PI) / (this.canvasStyle.barWidth + this.canvasStyle.barSpacing));
    const slicedPercent = Math.floor((maxBarNum * 25) / 100);
    const barNum = maxBarNum - slicedPercent;
    const freqJump = Math.floor(this.frequencyData.length / maxBarNum);

    for (let i = 0; i < barNum; i++) {
      const amplitude = this.frequencyData[i * freqJump];
      const alfa = (i * 2 * Math.PI) / maxBarNum;
      const beta = ((3 * 45 - this.canvasStyle.barWidth) * Math.PI) / 180;
      const x = 0;
      const y = radius - (amplitude / 12 - this.canvasStyle.barHeight);
      const w = this.canvasStyle.barWidth;
      const h = amplitude / 6 + this.canvasStyle.barHeight;

      this.canvasCtx.save();
      this.canvasCtx.translate(cx + this.canvasStyle.barSpacing, cy + this.canvasStyle.barSpacing);
      this.canvasCtx.rotate(alfa - beta);
      this.canvasCtx.fillRect(x, y, w, h);
      this.canvasCtx.restore();
    }
  }

  /**
   * Create visualizer fn instances.
   */
  private _createVisualizer() {
    this.setContext();
    this.setAnalyser();
    this.setFrequencyData();
    this.setBufferSourceNode();
    this.setMediaSource();
    this.setCanvasStyles();
  }
}
