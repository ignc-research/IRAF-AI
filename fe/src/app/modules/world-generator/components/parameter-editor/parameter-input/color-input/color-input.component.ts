import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfigColor } from 'src/app/models/config/config-color';

@Component({
  selector: 'app-color-input',
  templateUrl: './color-input.component.html',
  styleUrls: ['./color-input.component.scss']
})
export class ColorInputComponent {

  toggled = false;

  @Input()
  label: string = '';

  @Input()
  color: ConfigColor | any = [1, 0, 0, 1];

  @Output()
  colorChange: EventEmitter<ConfigColor> = new EventEmitter<ConfigColor>();

  get stringColor() {
    return `rgba(${this.color.map((x: number, idx: number) => idx < 3 ? x * 255 : x).join(',')})`;
  }

  set stringColor(value: string) {
    var rgba = value.replace('rgba(', '').replace(')', '').split(',').map(x => +x);
    this.color = [rgba[0] / 255, rgba[1] / 255, rgba[2] / 255, rgba[3]]
    this.colorChange.emit(this.color);
  }
}
