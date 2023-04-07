import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfigVec3 } from 'src/app/models/config/config-vec3';

@Component({
  selector: 'app-vec3-input',
  templateUrl: './vec3-input.component.html',
  styleUrls: ['./vec3-input.component.scss']
})
export class Vec3InputComponent {
  @Input()
  label: string = '';

  @Input()
  vec3: ConfigVec3 | any = [0, 0, 0];

  @Output()
  vec3Change: EventEmitter<ConfigVec3> = new EventEmitter<ConfigVec3>();

  update = () => this.vec3Change.emit(this.vec3);
}
