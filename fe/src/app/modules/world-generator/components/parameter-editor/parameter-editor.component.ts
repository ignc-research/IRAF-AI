import { Component, Input } from '@angular/core';
import { Parameters } from 'src/app/models/parameters';

@Component({
  selector: 'app-parameter-editor',
  templateUrl: './parameter-editor.component.html',
  styleUrls: ['./parameter-editor.component.scss']
})
export class ParameterEditorComponent {
  @Input()
  parameters!: Parameters;

  @Input()
  columns: number = 4;

  get width() {
    return (1.0 / this.columns) * 100 + '%';
  }
}
