import { Component, Input } from '@angular/core';
import { Parameter } from 'src/app/models/parameters';

@Component({
  selector: 'app-parameter-input',
  templateUrl: './parameter-input.component.html',
  styleUrls: ['./parameter-input.component.scss']
})
export class ParameterInputComponent {
  @Input()
  parameter!: Parameter;

  @Input()
  label!: string;
}
