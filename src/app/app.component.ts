import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Shot Control - v1';

  prepareTime$: number = +(localStorage.getItem('prepareTime') || 20);
  shouldAnnounce$: boolean = (localStorage.getItem('announceTime') === 'true') || true;
  announceTime$: number = +(localStorage.getItem('announceTime') || 3);
  drawTime$: number = +(localStorage.getItem('drawTime') || 5.5);
  shotPercentage$: number = +(localStorage.getItem('shotPercentage') || 75);

  stage: 'Prepare' | 'Draw' | 'Stopped' = 'Stopped';

  action: 'Shoot' | 'Let down' | undefined;

  timer: any;
  countDown: number | undefined;

  getReadySound: HTMLAudioElement;
  drawSound: HTMLAudioElement;
  shootSound: HTMLAudioElement;
  dontShootSound: HTMLAudioElement;

  constructor() {
    this.getReadySound = new Audio();
    this.getReadySound.src = "./assets/sounds/get_ready.wav";
    this.getReadySound.load();

    this.drawSound = new Audio();
    this.drawSound.src = "./assets/sounds/draw.wav";
    this.drawSound.load();

    this.shootSound = new Audio();
    this.shootSound.src = "./assets/sounds/shoot.wav";
    this.shootSound.load();

    this.dontShootSound = new Audio();
    this.dontShootSound.src = "./assets/sounds/dont_shoot.wav";
    this.dontShootSound.load();
  }

  get prepareTime(): number {
    return this.prepareTime$;
  }

  set prepareTime(value: number) {
    this.prepareTime$ = value;

    localStorage.setItem('prepareTime', '' + value)
  }

  get announceTime(): number {
    return this.announceTime$;
  }

  set announceTime(value: number) {
    this.announceTime$ = value;

    localStorage.setItem('announceTime', '' + value)
  }

  get shouldAnnounce(): boolean {
    return this.shouldAnnounce$;
  }

  set shouldAnnounce(value: boolean) {
    this.shouldAnnounce$ = value;

    localStorage.setItem('shouldAnnounce', '' + value)
  }

  get drawTime(): number {
    return this.drawTime$;
  }

  set drawTime(value: number) {
    this.drawTime$ = value;

    localStorage.setItem('drawTime', '' + value)
  }

  get shotPercentage(): number {
    return this.shotPercentage$;
  }

  set shotPercentage(value: number) {
    this.shotPercentage$ = value;

    localStorage.setItem('shotPercentage', '' + value)
  }

  doStart() {
    if (this.stage === 'Stopped') {
      this.stage = 'Prepare';

      this.startTimer();
    }
  }

  doStop() {
    this.stage = 'Stopped';

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
      this.action = undefined;
      this.countDown = undefined;
    }
  }

  startTimer() {
    if (this.stage === 'Stopped') {
      return;
    }

    if (this.stage === 'Prepare' && (this.countDown === undefined || this.countDown > 1)) {
      if (this.countDown === undefined) {
        this.countDown = this.prepareTime;
      } else {
        this.countDown--;
      }

      if (this.countDown === (this.prepareTime - 3)) {
        this.action = undefined;
      }

      if (this.shouldAnnounce$ && this.countDown === this.announceTime) {
        this.getReadySound.play();
      }

      this.timer = setTimeout(() => this.startTimer(), 1000);
    } else {
      this.stage = 'Draw';
      this.countDown = undefined;

      this.drawSound.play();
      this.timer = setTimeout(() => {
        const shotNumber = 100 * Math.random();

        this.action = shotNumber < this.shotPercentage ? 'Shoot' : 'Let down';

        if (this.action === 'Shoot') {
          this.shootSound.play();
        } else {
          this.dontShootSound.play();
        }

        this.stage = 'Prepare';

        this.startTimer();
      }, this.drawTime * 1000);
    }
  }
}
