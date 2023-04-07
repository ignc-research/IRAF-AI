import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MotionReplayService {

  get maxIndex() {
    return this.angles[Object.keys(this.angles)[0]]?.length ?? 0;
  }

  get robots() {
    return Object.keys(this.angles);
  }

  playing = false;

  currentIndex = 0;

  step_interval = 10;

  angles: { [key: string]: number[][] } = {};

  currentAngleState: BehaviorSubject<AngleState> = new BehaviorSubject<AngleState>({});

  constructor() { }

  public start() {
    if (this.playing) {
      return;
    }
    this.playing = true;
    this.animate();
  }

  public stop() {
    this.playing = false;
  }

  public animate = () => {
    if (!this.playing) {
      return;
    }

    this.currentIndex = (this.currentIndex + 1) % this.maxIndex;

    this.currentAngleState.next(Object.keys(this.angles).reduce((prev, curr) => {
      prev[curr] = this.angles[curr][this.currentIndex];
      return prev;
    }, {} as AngleState));

    setTimeout(() => this.animate(), this.step_interval);
  }
}
export type AngleState = { [key: string]: number[] };