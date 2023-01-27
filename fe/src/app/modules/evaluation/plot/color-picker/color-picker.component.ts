import { Component, Input } from '@angular/core';
import { Category, PlotService } from '../plot.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
  @Input()
  category!: Category;

  constructor(protected plotService: PlotService) {}

  changeColor (eventTarget: any, type: string): void {
    const inputColor = eventTarget.value;
    this.plotService.updateColor(type, inputColor);
  }
}
