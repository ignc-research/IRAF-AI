import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  private episodeColors: Map<number, string> = new Map();

  constructor() {
    this.generateDefaultColors();
  }

  generateDefaultColors(): void {
    const defaultColors = [
      'red',
      'blue',
      'green',
      'orange',
      'purple',
      'pink',
      'cyan',
      'magenta',
      'yellow',
      'lime',
    ];

    defaultColors.forEach((color, index) => {
      this.episodeColors.set(index + 1, color);
    });
  }

  getColor(episode: number): string {
    return this.episodeColors.get(episode) || 'gray';
  }

  setColor(episode: number, color: string): void {
    this.episodeColors.set(episode, color);
  }
}
