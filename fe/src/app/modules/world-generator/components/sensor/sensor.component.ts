import { NgtVector3, Ref } from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { URDFLink } from 'urdf-loader';
import { Sensor } from '../../services/scene.service';

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.scss']
})
export class SensorComponent {
  private _sensor!: Sensor;


  @Input()
  set sensor(value: Sensor) {
    this._sensor = value;
  }

  get sensor() {
    return this._sensor;
  }
}
