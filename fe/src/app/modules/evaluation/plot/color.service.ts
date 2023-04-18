import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  private experimentColors: Map<string, string> = new Map();

  constructor() {}

  generateColor(experimentName: string): string {
    const colors = [
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

    const availableColors = colors.filter(color => !Array.from(this.experimentColors.values()).includes(color));

    if (availableColors.length === 0) {
      console.warn('No more available colors. Reusing existing colors.');
      return colors[Math.floor(Math.random() * colors.length)];
    }

    const color = availableColors[0];
    this.experimentColors.set(experimentName, color);
    return color;
  }

  getColor(experimentName: string): string {
    return this.experimentColors.get(experimentName) || 'gray';
  }

  setColor(experimentName: string, color: string): void {
    this.experimentColors.set(experimentName, color);
  }
}
