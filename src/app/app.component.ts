import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Shot Control - v2';

  prepareTime$: number = +(localStorage.getItem('prepareTime') || 20);
  shouldAnnounce$: boolean = (localStorage.getItem('announceTime') === 'true') || true;
  announceTime$: number = +(localStorage.getItem('announceTime') || 3);
  drawTime$: number = +(localStorage.getItem('drawTime') || 5.5);
  shotPercentage$: number = +(localStorage.getItem('shotPercentage') || 75);

  stage: 'Prepare' | 'Draw' | 'Stopped' = 'Stopped';

  action: 'Shoot' | 'Let down' | undefined;

  timer: any;
  countDown: number | undefined;

  @ViewChild('player')
  player!: ElementRef;

  constructor() { }

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

  private play(file: string) {
    this.player.nativeElement.src = './assets/sounds/' + file + '.mp3';
    this.player.nativeElement.play();
  }

  private playTick() {
    this.player.nativeElement.src = "data:audio/mpeg;base64,//sQxAAAA+i5OrQRABC9mG+3BCAACCAH/f//yE5z0Od/yf//ITnO853/O9CEIygAgEPg+8AAUWCwVioVCAEBgAAD/65xat0KnkqrfOEKkxfjOI6H//Ofpf/q8jZTBgc8uM4jcsMMMMH/+xLEAgAE6M1XGCKAAAAANIOAAAQIAADL6BfAW9DeJCI78xlb/EWEVL/6REV//0Uw0SMb//AY4ypMQU1FMy45OS4zqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=";
    this.player.nativeElement.play();
  }

  doStart() {
    if (this.stage === 'Stopped') {
      this.stage = 'Prepare';

      this.player.nativeElement.src = "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
      this.player.nativeElement.play();

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

      if (this.shouldAnnounce$) {
        if (this.countDown === this.announceTime) {
          this.play('get_ready');
        } else if (this.countDown < this.announceTime) {
          this.playTick();
        }
      }

      this.timer = setTimeout(() => this.startTimer(), 1000);
    } else {
      if (this.stage === 'Prepare') {
        this.stage = 'Draw';
        this.countDown = this.drawTime;
        this.play('draw');
      }

      if (this.countDown && this.countDown > 1) {
        this.timer = setTimeout(() => {
          if (this.countDown) {
            this.countDown = (10 * this.countDown - 10) / 10;
          }
          this.playTick();
          this.startTimer();
        }, 1000);

      } else {
        this.timer = setTimeout(() => {
          const shotNumber = 100 * Math.random();

          this.action = shotNumber < this.shotPercentage ? 'Shoot' : 'Let down';

          if (this.action === 'Shoot') {
            this.play('shoot');
          } else {
            this.play('dont_shoot');
          }

          this.stage = 'Prepare';
          this.countDown = undefined;

          this.startTimer();
        }, (this.countDown || 1) * 1000);
      }
    }
  }
}
